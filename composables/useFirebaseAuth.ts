import { createUserWithEmailAndPassword, User, signInWithEmailAndPassword, signOut} from 'firebase/auth'
import { getDoc, doc, collection, addDoc, setDoc, query, getDocs, where } from 'firebase/firestore'

export default function() {
  const { $auth } = useNuxtApp()
  const { $firestore } = useNuxtApp()

  const user = useState<User | null>("fb_user", () => null)

  const cartStore = useCartStore()

  const registerUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const userCreds = await createUserWithEmailAndPassword($auth, email, password);
      
      if (userCreds) {
        user.value = userCreds.user

        // Create a cart document in Firestore with empty products array
        const cartCollection = collection($firestore, 'carts');
        const cartDoc = await addDoc(cartCollection, { products: [] });
        const cartId = cartDoc.id;

        // Create a user document in Firestore
        await setDoc(doc($firestore, "users", userCreds.user.uid), {
            email: userCreds.user.email,
            cartId: cartId,
        });

        return true
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        // handle error
      }
      return false
    }
    return false
  }

  const signInUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const userCreds = await signInWithEmailAndPassword($auth, email, password)
      if (userCreds) {
        user.value = userCreds.user
        return true
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        // handle error
      }
      return false
    }
    return false
  }
  
  const signOutUser = async (): Promise<boolean> => {
    try {
      await signOut($auth)
      user.value = null
      return true
    } catch (error: unknown) {
      if (error instanceof Error) {
        // handle error
      }
      return false
    }
  }

  const getCartRef = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc($firestore, "users", uid))
      if (userDoc.exists()) {
        const cartId = userDoc.data().cartId
        const cartRef = doc($firestore, "carts", cartId)
        return cartRef
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error)
      }
      return null
    }
  }

  const handleCartData = async (user: User) => {
    try {
      // Check if cart data is available in local storage
      const cachedCartData = localStorage.getItem("cachedCartData");
    
      if (cachedCartData) {
        // If cart data is available, update Firestore with the cached data
        const cartData = JSON.parse(cachedCartData);
        cartStore.products = cartData.products;
      } else {
        // collect cart from firestore:
        const cartRef = await getCartRef(user.uid);
        const cartSnapshot = await getDoc(cartRef);
        const cartData = cartSnapshot.exists() ? cartSnapshot.data() : {};
    
        // Cache cart data
        localStorage.setItem("cachedCartData", JSON.stringify(cartData));
    
        // update cart store
        cartStore.products = cartData.products;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error)
      }
    }
  }

    // Check if user is logged in
    onMounted(async () => {
      if ($auth.currentUser) {
        user.value = $auth.currentUser
        await handleCartData($auth.currentUser)
      }
    });


    interface Review {
        id?: string;
        productId: string;
        createdAt: string;
        rating: number;
        text: string;
        // Define other properties of a review here
      }

    
      const getReviews = async (productId: string): Promise<Review[]> => {
        const reviewsCollection = collection($firestore, "reviews");
        const reviewsQuery = query(reviewsCollection, where("product_id", "==", productId));
        const reviewsSnapshot = await getDocs(reviewsQuery);
        const reviews = reviewsSnapshot.docs.map((doc) => {
          return { id: doc.id, ...(doc.data() as Review) };
        });
        return reviews;
      }
    
      const submitReview = async (review: Review) => {
        const reviewsCollection = collection($firestore, "reviews");
        // Get the current date
        review.createdAt = new Date().toISOString();
        await addDoc(reviewsCollection, review);
      }

    
  



  
  return {
    user,
    registerUser,
    signInUser,
    signOutUser,
    getCartRef,
    getReviews,
    submitReview
  }
}
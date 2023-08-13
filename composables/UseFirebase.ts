import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
} from "firebase/auth";
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    addDoc
} from "firebase/firestore";

import { useFirebaseUser } from "./UseStates";

export const createUser = async (email, password) => {
    const auth = getAuth();

    try {
        const credentials = await createUserWithEmailAndPassword(auth, email, password);
        await createCartForUser(credentials.user.uid, email); // Create a cart for the new user
        return credentials;
    } catch (error) {
        console.error("Error creating user:", error.code, error.message);
        throw error;
    }
};

export const signInUser = async (email, password) => {
    const auth = getAuth();

    try {
        const credentials = await signInWithEmailAndPassword(auth, email, password);
        return credentials;
    } catch (error) {
        console.error("Error signing in:", error.code, error.message);
        throw error;
    }
};

export const initUser = async () => {
    const auth = getAuth();
    // const userCookie = useCookie('userCookie');
    const firebaseUser = useFirebaseUser();
    // const cartStore = useCartStore();

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log("Auth Changed: ", user);

            // Fetch and update cart data
            const cartData = await getCartDataForUser(user.uid);
            // Update your local state with cartData.products
            // Update the productsRef with cartData.products
            // productsRef.value = cartData.products;
            
        } else {
            console.log("Auth Changed: User not signed in");
        }

        firebaseUser.value = user;
        // userCookie.value = user; // ignore error for serialization
    });

    firebaseUser.value = auth.currentUser;
};

export const signOutUser = async () => {
    const auth = getAuth();

    try {
        await auth.signOut();
        console.log("Sign out: Successful");
    } catch (error) {
        console.error("Error signing out:", error.code, error.message);
        throw error;
    }
};

async function createCartForUser(userId, email) {
    const firestore = getFirestore();
    const cartRef = await addDoc(collection(firestore, "carts"), { products: [] });
    const cartId = cartRef.id;

    const userDocRef = doc(firestore, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
        await updateDoc(userDocRef, { cartId, email });
    } else {
        await setDoc(userDocRef, { cartId, email });
    }
}

export async function getCartDataForUser(userId) {
    console.log("getCartDataForUser: ", userId);
    const firestore = getFirestore();
    const userDocRef = doc(firestore, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const cartId = userData.cartId;

        if (cartId) {
            const cartDocRef = doc(firestore, "carts", cartId);
            const cartDocSnap = await getDoc(cartDocRef);

            if (cartDocSnap.exists()) {
                const cartData = cartDocSnap.data();
                return cartData;
            }
        }
    }

    return { products: [] };
}

export async function updateCartInFirebase(products) {
    const firestore = getFirestore();

    // get current user
    const auth = getAuth();
    const user = auth.currentUser;
  
    
    if (user) {
      const userDocRef = doc(firestore, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
  
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const cartId = userData.cartId;
  
        if (cartId) {
          const cartDocRef = doc(firestore, "carts", cartId);
          await updateDoc(cartDocRef, { products });
        }
      }
    }
  }

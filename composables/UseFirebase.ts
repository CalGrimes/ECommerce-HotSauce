//https://firebase.google.com/docs/auth/web/start

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { 
  doc, 
  addDoc, 
  getDoc, 
  setDoc, 
  getFirestore, 
  collection } from "firebase/firestore";


export const createUser = async (email, password) => {
  const auth = getAuth();

  try {
    const credentials = await createUserWithEmailAndPassword(auth, email, password);

    // Initialize Firestore
    const db = getFirestore();

    // Create a cart document in Firestore with empty products array
    const cartCollection = collection(db, 'carts');
    const cartDoc = await addDoc(cartCollection, { products: [] });
    const cartId = cartDoc.id;

    // Create a user document in Firestore
    await setDoc(doc(db, "users", credentials.user.uid), {
      email: credentials.user.email,
      cartId: cartId,
    });

    return credentials;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorCode, errorMessage);
    return null;
  }
};

export const signInUser = async (email, password) => {
  const auth = getAuth();
  const credentials = await signInWithEmailAndPassword(
    auth,
    email,
    password
  ).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
  return credentials;
};


export const getCartRef = async (uid) => {
  const firestore = getFirestore();
  // get cartId from user
  const userRef = doc(firestore, "users", uid);
  const userSnap = await getDoc(userRef);
  const user = userSnap.data();
  console.log(user);
  const cartId = user.cartId;

  // get cart from cartId
  return doc(firestore, "carts", cartId);
};

export const initUser = async () => {
  const auth = getAuth();
  const firebaseUser = useFirebaseUser();
  firebaseUser.value = auth.currentUser;
  const cartStore = useCartStore();

  const userCookie = useCookie("userCookie");

  const router = useRouter();

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log(user);
      // collect cart from firestore:
      const cartRef = await getCartRef(user.uid);
      const cartSnapshot = await getDoc(cartRef);
      const cartData = cartSnapshot.exists ? cartSnapshot.data() : {};

      // update cart store
      cartStore.products = cartData.products;
      
    } else {
      //if signed out
      router.push("/");
    }

    firebaseUser.value = user;

    // @ts-ignore
    userCookie.value = user; //ignore error because nuxt will serialize to json

    $fetch("/api/auth", {
      method: "POST",
      body: { user },
    });
  });
};

export const signOutUser = async () => {
  const auth = getAuth();
  const result = await auth.signOut();
  return result;
};
import { initializeApp } from "firebase/app";
import {
  getAuth,
} from "firebase/auth";

import {
  getFirestore
} from "firebase/firestore";


export default defineNuxtPlugin(async (nuxtApp) => {

  const config = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: config.FIREBASE_API_KEY,
    authDomain: config.FIREBASE_AUTH_DOMAIN,
    projectId: config.FIREBASE_PROJECT_ID,
    storageBucket: config.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: config.FIREBASE_MESSAGING_SENDER_ID,
    appId: config.FIREBASE_APP_ID,
    measurementId: config.FIREBASE_MEASUREMENT_ID,
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const auth = getAuth();
  const firestore = getFirestore();

  nuxtApp.vueApp.provide('auth', auth);
  nuxtApp.provide('auth', auth);

  nuxtApp.vueApp.provide('firestore', firestore);
  nuxtApp.provide('firestore', firestore);

  // Check if user is already logged in
  if (auth.currentUser) {
    await initUser();
  } else {
    auth.onAuthStateChanged(() => {
      initUser();
    });
  }
});
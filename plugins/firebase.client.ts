import { initializeApp } from 'firebase/app'
import { getAuth } from "firebase/auth"
import { getFirestore } from 'firebase/firestore'
// import { getAnalytics } from "firebase/analytics"

export default defineNuxtPlugin(nuxtApp => {
    const publicConfig = useRuntimeConfig().public
    // const privateConfig = useRuntimeConfig().private

    const firebaseConfig = {
      apiKey: publicConfig.FIREBASE_API_KEY,
      authDomain: publicConfig.FIREBASE_AUTH_DOMAIN,
      projectId: publicConfig.FIREBASE_PROJECT_ID,
      storageBucket: publicConfig.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: publicConfig.FIREBASE_MESSAGING_SENDER_ID,
      appId: publicConfig.FIREBASE_APP_ID,
      measurementId: publicConfig.FIREBASE_MEASUREMENT_ID,
    };

    const app = initializeApp(firebaseConfig)

    // const analytics = getAnalytics(app)
    const auth = getAuth(app)
    const firestore = getFirestore(app)

    nuxtApp.vueApp.provide('auth', auth)
    nuxtApp.provide('auth', auth)

    nuxtApp.vueApp.provide('firestore', firestore)
    nuxtApp.provide('firestore', firestore)
})
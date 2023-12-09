import { defineNuxtConfig } from "nuxt/config";
// import path from "path";

// requireEnvVars();

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: ["@/assets/main.css", "@formkit/themes/genesis"],
  imports: {
    dirs: ["stores"],
  },
  modules: [
    "@formkit/nuxt",
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", "acceptHMRUpdate"],
      },
    ],
  ],
  runtimeConfig: {
    public: {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
      contentfulSpace: process.env.NUXT_CONTENTFUL_SPACE,
      contentfulPublicAccessToken:
      process.env.NUXT_CONTENTFUL_PUBLIC_ACCESS_TOKEN,
    },
    private: {
      stripeSecret: process.env.STRIPE_SECRET,
      FIREBASE_API_SECRET: process.env.FIREBASE_API_SECRET,
    }
  },
  generate: {
    dir: "dist",
  },
  build: {
    transpile:
      process.env.npm_lifecycle_script === "nuxt generate"
        ? ["contentful", "pinia"]
        : ["pinia"],
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});

// function requireEnvVars() {
//   const map = {
//     "Stripe secret token": process.env.STRIPE_SECRET,
//   };
//   let ready = true;
//   for (const label in map) {
//     if (!map[label]) {
//       ready = false;
//       console.error(
//         `You must provide a ${label} in .env to start the project (see the Setup Guide for more instructions: https://vueschool.notion.site/Preparation-Guide-cf256a7352704d27bb7946c47907d40e)`
//       );
//     }
//   }

//   if (!ready) process.exit();
// }

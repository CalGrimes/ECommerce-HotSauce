import { createClient } from "contentful";
import contentful from 'contentful'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public

  const createClientFunc = process.env.NODE_ENV === 'development' ? createClient : contentful.createClient

  const client = createClientFunc({
    space: config.contentfulSpace,
    accessToken: config.contentfulPublicAccessToken
  });

  return {
    provide: {
      contentfulClient: client,
    },
  };
});
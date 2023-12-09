// middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = useFirebaseUser()
  
    // redirect the user to the login page
    console.log("User: ", user);
    if (!user.value) {
      return navigateTo({
        path: '/login',
        query: {
          redirect: to.fullPath,
        },
      })
    }
  })
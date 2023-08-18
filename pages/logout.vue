<script setup>
const firebaseUser = useFirebaseUser();
const router = useRouter();
await signOutUser();

onMounted(() => {
  window.location = "/login";
});
</script>

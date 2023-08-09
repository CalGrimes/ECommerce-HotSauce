<script setup>
// const { auth } = useDeskree();
const firebaseUser = useFirebaseUser();
const router = useRouter();
await signOutUser();

onMounted(() => {
  window.location = "/login";
});
</script>

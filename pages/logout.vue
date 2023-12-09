<script setup>
const { signOutUser } = useFirebaseAuth();

await signOutUser();
onMounted(() => {
  window.location = "/login";
});
</script>

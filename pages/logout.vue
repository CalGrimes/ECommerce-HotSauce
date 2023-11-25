<script setup>
import useFirebaseAuth from '@/composables/useFirebaseAuth';



const { signOutUser } = useFirebaseAuth();


await signOutUser();
onMounted(() => {
  window.location = "/login";
});
</script>

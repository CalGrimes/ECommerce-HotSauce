<script setup>
import { watchEffect } from 'vue';

const cartStore = useCartStore();
const firebaseUser = useFirebaseUser();
const orderedProducts = ref([]);
const orderedTotal = ref(0);
const loading = ref(true);

watchEffect(() => {
  if (firebaseUser.value && cartStore.products.length > 0) {
    orderedProducts.value = cartStore.products;
    orderedTotal.value = cartStore.subtotal;

    cartStore.clearCart();

    loading.value = false;
  }
  setTimeout(() => {
      loading.value = false;
    }, 1000); // Delay of 1000 milliseconds (1 second)
});
</script>

<template>
  <div v-if="loading" class="flex justify-center items-center mt-10">
    <AppSpinner />
  </div>

  <div v-else class="mt-10 max-w-6xl mx-auto p-5">
    <h1 class="text-3xl">Thank you for your purchase!</h1>
    <h2>Order Summary</h2>
    <ul class="ml-5 list-inside list-disc">
      <li v-for="product in orderedProducts" :key="product.sys.id">
        {{ product.fields.name }}
      </li>
    </ul>
    <strong>Total: </strong>${{ orderedTotal }}
    <div>
      <NuxtLink to="/" class="btn btn-primary">Continue Shopping</NuxtLink>
    </div>
  </div>
</template>
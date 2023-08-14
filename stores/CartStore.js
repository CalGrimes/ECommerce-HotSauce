import { defineStore, acceptHMRUpdate } from "pinia";
import { watchDebounced } from "@vueuse/core";
import {
  createUser,
  signInUser,
  signOutUser,
  initUser,
} from "../composables/UseFirebase"; // Import your Firebase functions

export const useCartStore = defineStore("CartStore", () => {
  // state
  const products = ref([]);
  const taxRate = 0.1;
  const isFirstLoad = ref(false);
  const loading = ref(false);

  // watch(products, () => {
  //   // make our request to Firebase
  //   // Update cart data in Firebase when products change
  //   // This logic will be handled by the watchDebounced below
  // }, { deep: true });

  // getters
  const count = computed(() => products.value.length);
  const isEmpty = computed(() => count.value === 0);
  const subtotal = computed(() => {
    return products.value.reduce((p, product) => {
      return product.price ? product.price * product.count + p : p;
    }, 0);
  });
  const taxTotal = computed(() => subtotal.value * taxRate);
  const total = computed(() => taxTotal.value + subtotal.value);

  // actions
  function removeProducts(productIds) {
    productIds = Array.isArray(productIds) ? productIds : [productIds];
    products.value = products.value.filter(
      (p) => !productIds.includes(p.id)
    );
  }

  function addProduct(product, count) {
    const existingProduct = products.value.find(
      (p) => p.id === product.id
    );
    if (existingProduct) {
      existingProduct.count += count;
    } else {
      products.value.push({ ...product, count });
    }
    return count;
  }

  function updateProduct(product, count) {
    const existingProduct = products.value.find(
      (p) => p.id === product.id
    );
    if (existingProduct) {
      existingProduct.count = count;
    }
    if (count <= 0) {
      removeProducts(product.id);
    }
  }

  // triggers
  // init data
  watch(isFirstLoad, async (newValue) => {
    if (newValue) {
      loading.value = true;
      // const cartData = await getCartDataForUser(); // Fetch cart data from Firebase
      // cartData.products.forEach((product) => addProduct(product, product.count));
      loading.value = false;
      setTimeout(() => (isFirstLoad.value = false), 1000);
    }
  });

  // update data whenever products change
  watchDebounced(
    products,
    async () => {
      if (isFirstLoad.value) return;
      // await updateCartInFirebase(products.value); // Update cart data in Firebase
    },
    {
      debounce: 500,
      deep: true,
    }
  );

  return {
    products,
    taxRate,
    count,
    isEmpty,
    subtotal,
    taxTotal,
    total,
    loading,
    removeProducts,
    addProduct,
    updateProduct,
    createUser,
    signInUser,
    signOutUser,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot));
}

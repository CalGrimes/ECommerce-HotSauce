<template>
    <div class="star-rating mb-4">
      <span
        v-for="(star, index) in stars"
        :key="index"
        class="star"
        :class="{ 'filled': index < internalValue }"
        @click="selectRating(index + 1)"
      >
        &#9733;
      </span>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    modelValue: {
      type: Number,
      required: true,
    },
  });
  
  const emit = defineEmits();
  
  const internalValue = ref(props.modelValue);
  const stars = 5; // Number of stars in the rating system
  
  const selectRating = (rating) => {
    internalValue.value = rating;
    emit('update:modelValue', internalValue.value);
  };
  </script>
  
  <style scoped>
  .star-rating {
    display: inline-block;
    font-size: 36px;
    color: #615f53; /* Star color */
  }
  
  .star {
    cursor: pointer;
  }
  
  .filled {
    color: #FFD700; /* Filled star color */
  }
  </style>
  
<script setup lang="ts">
import { groupBy } from "lodash";
import { useAlertsStore } from "~~/stores/AlertsStore";

const props = defineProps({
  productId: {
    type: String,
    required: true,
  },
});
interface Review {
  productId: string;
  createdAt: string;
  rating: number;
  text: string;
  // Define other properties of a review here
}
const useAlertStore = useAlertsStore();
const firebaseUser = useFirebaseUser();
const loggedIn = computed(() => !firebaseUser.value);
const reviews = ref<Review[]>([]);
const status = ref("waiting"); // loading, loaded, error

// Math
const avg = computed(() =>
  (
    reviews.value.reduce((p, c) => p + c.rating, 0) / reviews.value.length
  ).toFixed(1)
);

const groupedReviews = computed(() => {
  return groupBy(reviews.value, "rating");
});

// Reviews cards
const showReviews = ref(false);
function handleShowReviewsToggle() {
  showReviews.value = !showReviews.value;
  showReviewForm.value = false;
}


async function loadReviews() {
  status.value = "loading";
  try {
    const res = await getReviews(props.productId);
    console.log("reviews", res);
    reviews.value = res.map((review) => ({
        ...review,
      }));
    status.value = "loaded";
  } catch (error) {
    console.error("error loading reviews", error);
    status.value = "error";
  }
}

// Reviews form
const formSubmitting = ref(false);
const showReviewForm = ref(false);
function handleShowFormToggle() {
  showReviewForm.value = !showReviewForm.value;
  showReviews.value = false;
}

async function handleReviewSubmit(form) {
  if (!loggedIn.value) return;
  formSubmitting.value = true;
  try {
    const res = await submitReview({
      ...form,
      product_id: props.productId,
    });
    reviews.value.push(res);
    formSubmitting.value = false;
    showReviewForm.value = false;
    useAlertStore.success("Review submitted successfully!");
  } catch (error) {
    // Handle error
    console.error("Error submitting review:", error);
    formSubmitting.value = false;
    useAlertStore.error("Error submitting review");
  }
}
</script>

<template>
  <div>
    <hr class="my-10" />
    <button @click="loadReviews" class="underline flex items-center">
      View Product Reviews
      <AppSpinner class="ml-3" size="sm" v-if="status === 'loading'" />
    </button>
  </div>

  <div class="my-10" v-if="status === 'loaded'">
    <h4 class="text-lg mb-5">Customer Reviews and Ratings</h4>
    <div class="flex items-center">
      <div class="card border-2 border-primary p-5">
        <div class="card-content" v-if="reviews.length">
          <span class="text-4xl">{{ avg }}</span>
          out of
          <span class="text-4xl">5</span>
          <div class="text-2xs text-gray-700">
            ({{ reviews.length }} Reviews)
          </div>
        </div>
        <div class="card-content text-center" v-else>
          <div class="text-lg bold text-primary">No Reviews Yet</div>
          <button class="text-sm underline" @click="showReviewForm = true">
            Be the first to write one!
          </button>
        </div>
      </div>
      <div class="pl-5">
        <div v-for="n in 5" class="text-xs flex items-center">
          {{ n }} Stars

          <input
            class="ml-2 mr-2"
            type="range"
            max="100"
            :value="
              groupedReviews[n]
                ? (groupedReviews[n].length / reviews.length) * 100
                : 0
            "
            disabled
          />
          ({{ groupedReviews[n]?.length || 0 }} Reviews)
        </div>
      </div>
    </div>
    <button
      v-if="loggedIn"
      class="underline my-5"
      @click="handleShowFormToggle()"
    >
      Write a Review
    </button>
    <NuxtLink v-if="!loggedIn" to="/login">
      <button class="underline my-5">Log in To Write a Review</button>
    </NuxtLink>
    <span class="text-gray-400 mx-2">|</span>
    <button class="underline my-5" @click="handleShowReviewsToggle">
      {{ showReviews ? "Hide All Reviews" : "Show All Reviews" }}
    </button>

    <div v-if="showReviews">
      <ProductReviewsCard
        v-for="review in reviews"
        :key="review.uid"
        :review="review"
      />
    </div>

    <ProductReviewsCardForm
      v-if="showReviewForm"
      @submitReview="handleReviewSubmit"
      :loading="formSubmitting"
    />
  </div>
</template>
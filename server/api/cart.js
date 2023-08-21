import Stripe from "stripe";

export default defineEventHandler(async (event) => {
    const stripeSecret = useRuntimeConfig().private.stripeSecret;
    const stripe = new Stripe(stripeSecret);
    return await stripe.products.list();
})
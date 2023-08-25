import Stripe from "stripe";

export default defineEventHandler(async (event) => {
    const body = await useBody(event);
    const stripeSecret = useRuntimeConfig().private.stripeSecret;
    const stripe = new Stripe(stripeSecret);

    console.log(body);
    const res =  await stripe.products.list( {
        ids: body.products.map((product) => product.id),
    });
    const line_items = res.data.map((product) => ({
        price: product.default_price,
        quantity: body.products.find((p) => p.id === product.id).quantity,
    }));
    const session = await stripe.checkout.sessions.create({
        cancel_url: body.cancel_url,
        success_url: body.success_url,
        mode: "payment",
        line_items: line_items,
    });
    return session;

});

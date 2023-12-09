import Stripe from "stripe";

export default defineEventHandler(async (event) => {
    console.log("cart.post");
    const body = await readBody(event);
    const stripe = new Stripe(useRuntimeConfig().private.stripeSecret);

    console.log(stripe);
    console.log(body.products.map((product) => product.id));
    const res =  await stripe.products.list( {
        ids: body.products.map((product) => product.id),
    });
    const line_items = res.data.map((product) => ({
        price: product.default_price * 100,
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

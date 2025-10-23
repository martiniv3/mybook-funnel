// Node 18 runtime
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    // минимум: price и success/cancel URL
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name: 'Електронна книга — Заглавие' },
          unit_amount: 999, // 9.99 EUR -> 999 cents
        },
        quantity: 1,
      }],
      success_url: `${process.env.SITE_URL}/thankyou.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SITE_URL}/`,
    });

    return { statusCode: 200, body: JSON.stringify({ url: session.url || session.id ? session.url : null }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

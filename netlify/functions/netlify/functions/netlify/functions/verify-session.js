const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const { session_id } = (event.queryStringParameters || {});
  if (!session_id) return { statusCode: 400, body: 'Missing session_id' };

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status === 'paid') {
      // Може да генерираш signed URL към S3 или просто да върнеш статичен линк (по-малко secure)
      const downloadUrl = `${process.env.SITE_URL}/assets/mybook.pdf`;
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: true, downloadUrl }),
      };
    } else {
      return { statusCode: 403, body: 'Payment not completed' };
    }
  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
};

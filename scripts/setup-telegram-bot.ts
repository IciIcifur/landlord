const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const WEBHOOK_URL = `${API_URL}/api/telegram/webhook`;

async function setupWebhook() {
  if (!TELEGRAM_BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN environment variable is required');
    process.exit(1);
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: WEBHOOK_URL,
          allowed_updates: ['message', 'callback_query'],
        }),
      },
    );

    const result = await response.json();

    if (result.ok) {
      console.log('✅ Webhook set successfully!');
      console.log(`Webhook URL: ${WEBHOOK_URL}`);
    } else {
      console.error('❌ Failed to set webhook:', result);
    }

    const infoResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo`,
    );
    const info = await infoResponse.json();

    console.log('\n📋 Current webhook info:');
    console.log(JSON.stringify(info.result, null, 2));
  } catch (error) {
    console.error('Error setting up webhook:', error);
  }
}

setupWebhook();

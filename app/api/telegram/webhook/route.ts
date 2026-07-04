import { type NextRequest, NextResponse } from 'next/server';
import { TelegramBot } from '@/app/lib/telegram/bot';
import connectDB from '@/app/lib/utils/db';

let bot: TelegramBot | null = null;

function getBot(): TelegramBot {
  if (!bot) {
    bot = new TelegramBot();
  }
  return bot;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const update = await req.json();

    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!telegramToken) {
      return NextResponse.json(
        { error: 'Bot token not configured' },
        { status: 500 },
      );
    }

    await getBot().handleUpdate(update);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Telegram webhook is running' });
}

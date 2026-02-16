/**
 * Telegram Integration
 * Sends notifications to Telegram when form is submitted
 */

export interface TelegramMessage {
  chat_id: string;
  text: string;
  parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
}

/**
 * Send a message to Telegram
 */
export async function sendTelegramMessage(
  message: string
): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // Skip if Telegram is not configured
  if (!botToken || !chatId) {
    console.warn('⚠️  Telegram credentials not set, skipping notification');
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Telegram API error:', error);
      return false;
    }

    console.log('✅ Telegram message sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    return false;
  }
}

/**
 * Format lead notification for Telegram
 */
export function formatLeadNotification(
  lead: {
    name: string;
    email: string;
    phone?: string;
    company: string;
    message: string;
  },
  qualification?: {
    category: string;
    reason: string;
  },
  research?: string
): string {
  let message = `<b>🎯 New Lead Submitted!</b>\n\n`;

  message += `<b>Name:</b> ${lead.name}\n`;
  message += `<b>Email:</b> ${lead.email}\n`;
  if (lead.phone) message += `<b>Phone:</b> ${lead.phone}\n`;
  message += `<b>Company:</b> ${lead.company}\n`;
  message += `<b>Message:</b> ${lead.message}\n`;

  if (qualification) {
    message += `\n<b>📊 Qualification</b>\n`;
    message += `<b>Category:</b> ${qualification.category}\n`;
    message += `<b>Reason:</b> ${qualification.reason}\n`;
  }

  if (research) {
    message += `\n<b>🔍 Research Summary</b>\n`;
    message += research.slice(0, 300);
    if (research.length > 300) message += '...';
  }

  return message;
}

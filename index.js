const TelegramBot = require('node-telegram-bot-api');
const axios = require("axios");

// 🔑 Bot tokeningiz
const token = "6071099952:AAHXavzUgqV-eLHzQyfgWwJPAwGKtQegDI0";

// 🔑 RapidAPI kalitingiz
const RAPID_API_KEY = "32fa350e92mshc528d8c5ab44229p14022bjsnee0d6caf1f2b";

const bot = new TelegramBot(token, { polling: true });

async function InstagramDownloader(url) {
  try {
    const options = {
      method: 'GET',
      url: 'https://instagram-downloader-download-instagram-videos-stories.p.rapidapi.com/index',
      params: { url },
      headers: {
        'X-RapidAPI-Key': RAPID_API_KEY,
        'X-RapidAPI-Host': 'instagram-downloader-download-instagram-videos-stories.p.rapidapi.com'
      }
    };

    const res = await axios.request(options);
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === '/start') {
    bot.sendMessage(chatId, "👋 Salom! Menga istalgan Instagram linkini yuboring.\n\nMen sizga post, reels, story yoki IGTV ni yuklab beraman ✅");
    return;
  }

  bot.sendMessage(chatId, "⏳ Yuklanmoqda, biroz kuting...");

  const data = await InstagramDownloader(text);

  if (!data || !data.media) {
    bot.sendMessage(chatId, "❌ Yuklab bo‘lmadi. Bu private akkaunt bo‘lishi mumkin.");
    return;
  }

  try {
    if (Array.isArray(data.media)) {
      // Karusel (ko‘p rasm/video)
      for (let item of data.media) {
        if (item.includes(".mp4")) {
          await bot.sendVideo(chatId, item);
        } else if (item.includes(".jpg")) {
          await bot.sendPhoto(chatId, item);
        }
      }
    } else {
      // Bitta fayl (video yoki rasm)
      if (data.media.includes(".mp4")) {
        await bot.sendVideo(chatId, data.media);
      } else if (data.media.includes(".jpg")) {
        await bot.sendPhoto(chatId, data.media);
      }
    }
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "❌ Xatolik yuz berdi.");
  }
});

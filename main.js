const TelegramBot = require("node-telegram-bot-api");
const ytdl = require("@distube/ytdl-core");
const fs = require("fs");

const token = "6298580729:AAH_mdCi-Nl15hVs8kIpnnqPMRYX3NPy9Nw";
const bot = new TelegramBot(token, { polling: true });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const url = msg.text;

  if (ytdl.validateURL(url)) {
    bot.sendMessage(chatId, "⏳ Video yuklanmoqda...");

    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;

    const filePath = `${title}.mp4`;

    ytdl(url, { quality: "lowest" }) // sifatni tanlash mumkin: highest/lowest
      .pipe(fs.createWriteStream(filePath))
      .on("finish", () => {
        bot.sendVideo(chatId, filePath, { caption: title }).then(() => {
          fs.unlinkSync(filePath); // yuklab bo‘lgach, faylni o‘chirib tashlaydi
        });
      });
  } else {
    bot.sendMessage(chatId, "❌ Bu YouTube link emas");
  }
});

require("dotenv").config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require("axios");

const token = '6071099952:AAHXavzUgqV-eLHzQyfgWwJPAwGKtQegDI0';
// const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(token, { polling: true });

async function InstgarmadanYuklovchilar(urlID) {
  try {
    const options = {
      method: 'GET',
      url: 'https://instagram-story-downloader-media-downloader.p.rapidapi.com/index',
      params: { url: `${urlID}` },
      headers: {
        'X-RapidAPI-Key': "32fa350e92mshc528d8c5ab44229p14022bjsnee0d6caf1f2b",
        'X-RapidAPI-Host': 'instagram-story-downloader-media-downloader.p.rapidapi.com'
      }
    };

    return await axios.request(options)
  } catch (error) {
    console.log(error);
  }
}



bot.on('message', (msg) => {
  const userID = msg.from.id
  if(msg.text=='/start'){
    bot.sendMessage(userID,'Salom bu bot instagramdan video yuklaydi')
  }else{
    try {
      const video = InstgarmadanYuklovchilar(msg.text)
      video.then(res => {
        bot.sendVideo(userID,res.data.media,{caption:'Mana shu sizning videoyingiz!'})
      }).catch(err=>{
        bot.sendMessage(userID,'menimcha bu zakritiy akkaunt')
      })
    } catch (error) {
      bot.sendMessage(userID,'menimcha bu zakritiy akkaunt')
    }
  }
});


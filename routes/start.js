const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
const User = require('../models/user');

const startAllBots = async () => {
  try {
    const allUsers = await User.find({});

    const botPromises = allUsers.flatMap(user =>
      user.botTokens.map(tokenData => {
        const botClient = new Client();

        return new Promise((resolve, reject) => {
          botClient.login(tokenData.botToken).catch(error => {
            console.error(`Token Giriş Yapamadı ${tokenData.botToken}:`, error);
            return reject(error);
          });

          botClient.once('ready', async () => {
            try {
              const guild = botClient.guilds.cache.get(tokenData.serverId);
              if (!guild) {
                console.log(`server id yanlış: ${tokenData.serverId}`);
                return reject(new Error(`server id yanlış: ${tokenData.serverId}`));
              }

              const channel = guild.channels.cache.get(tokenData.channelId);
              if (!channel || !channel.isVoice()) {
                console.log(`kanal id yanlış: ${tokenData.channelId}`);
                return reject(new Error(`kanal id yanlış: ${tokenData.channelId}`));
              }

              await new Promise(resolve => setTimeout(resolve, 5000));

              joinVoiceChannel({
                channelId: channel.id,
                guildId: guild.id,
                adapterCreator: guild.voiceAdapterCreator,
                selfDeaf: false,
                group: 'allah 1'
              });

              botClient.user.setPresence({
                activities: [
                  {
                    name: tokenData.statusText,
                    type: 'PLAYING',
                  },
                ],
                status: tokenData.activitiesText,
              });

              console.log(`${botClient.user.tag} olarak ${channel.name} ses kanalına katıldı.`);
              resolve();
            } catch (err) {
              console.error(`Bot token ${tokenData.botToken} ses kanalına katılma hatası:`, err);
              reject(err);
            }
          });

          botClient.on('error', (error) => {
            console.error(`Bot token ${tokenData.botToken} login hatası:`, error);
            reject(error);
          });
        });
      })
    );

    await Promise.all(botPromises);

  } catch (error) {
    console.error('Tokenler Bağlanamadı', error);
  }
};


module.exports = startAllBots;

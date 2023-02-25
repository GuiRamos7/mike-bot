require('dotenv').config();
const { GuildMember, ApplicationCommandOptionType } = require('discord.js');
const ytdl = require('ytdl-core');
const { DisTube } = require('distube');

const { Player } = require('discord-player');
const Client = require('./Client/Client');
const play = require('play-dl'); // Everything

const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
} = require('@discordjs/voice');

const client = new Client();

const { YtDlpPlugin } = require('@distube/yt-dlp');
const distube = new DisTube(client, {
  searchSongs: 5,
  searchCooldown: 30,
  leaveOnEmpty: false,
  leaveOnFinish: false,
  leaveOnStop: false,
  plugins: [new YtDlpPlugin({ update: false })],
});

client.on('ready', (client) => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  if (
    !(message.member instanceof GuildMember) ||
    !message.member.voice.channel
  ) {
    return void message.reply({
      content: 'Você precisa entrar em algum pelotão soldado',
      ephemeral: true,
    });
  }

  let command = message.content.split(' ')[0];

  if (command === '!play') {
    let args = message.content.split('play ')[1].split(' ')[0];

    console.log('aqui');
    distube.play(message.member.voice.channel, args, {
      message,
      textChannel: message.channel,
      member: message.member,
    });
  }

  if (command === '!skip') distube.skip(message);
  if (command === '!pause') distube.pause(message);
  if (command === '!resume') distube.resume(message);

  if (command === '!lista') {
    const queue = distube.getQueue(message);
    if (!queue) {
      message.channel.send('Não está tocando nada');
    } else {
      message.channel.send(
        `O que está na lista:\n${queue.songs
          .map(
            (song, id) =>
              `**${id ? id : 'Playing'}**. ${song.name} - \`${
                song.formattedDuration
              }\``
          )
          .slice(0, 10)
          .join('\n')}`
      );
    }
  }
});
client.login(process.env.TOKEN ?? process.env.NODE_ENV ?? '');
console.log('oi');

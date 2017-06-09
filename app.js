const Discord = require('discord.js');
const client = new Discord.Client();
const request = require('request');
var fullJSON = '';
client.on('ready', () => {
  console.log('I am ready!');
});


function getJson(){
  request('https://back.discord.eliens.co/samples', (error, response, body) => {
    if(error) console.log('error:', error); // Print the error if one occurred
    fullJSON = body;
  });

}
getJson();

client.on('message', message => {
  if(message.author.bot) return;
  if(!message.content.startsWith(config.prefix)) return;

  let command = message.content.split(" ")[0]; //removes prefix
  command = command.slice(config.prefix.length)

  let arg = message.content.split(" ").slice(1); //makes args


  if (message.content==='smae') {
    message.channel.send('<:smae:318972179247005697>');
  } else

  if (command === 'send'&& arg[0]!=""){
    message.channel.send(arg.join(" "))
  } else

  if (command === 'help') {
    message.channel.send("`help (no args) - show this`\n`board (link) - play soundbyte from discord.eliens.co`\n`smae (no args) - sends smae emoji`\n`send (what to send) - sends what you tell it to`");
  }

  if (command === 'leave') {
    message.member.voiceChannel.leave();
  }

  if (command === "board") {
    if (message.member.voiceChannel) {
      message.member.voiceChannel.join()
      .then(connection => { // Connection is an instance of VoiceConnection
        getJson();
        let parsedJSON = JSON.parse(fullJSON);
        let sampleURL = '';
        let tempArray = arg[0].split('/');
        let soundId = tempArray[tempArray.length-1];
        parsedJSON.samples.forEach((sample) => {
          if(sample.id == soundId) {
            sampleURL = 'https://back.discord.eliens.co/samples/' + sample.path;
          }
        });
          const dispatcher = connection.playArbitraryInput(sampleURL);
          console.log(sampleURL);
          //message.reply(sampleURL);
          dispatcher.on("end", end => {
            message.member.voiceChannel.leave();
          });

        })
        .catch(console.log);
      } else {
        message.reply('You need to join a voice channel first!');
      }
    }

  });

  client.login(process.env.BOT_TOKEN);

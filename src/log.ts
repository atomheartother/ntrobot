import { TextChannel } from 'discord.js'

const log =  (message : string, channel : TextChannel = null) => {
    const dateString = new Date().toLocaleString('en-GB');
    if (!channel) {
        console.log(`${dateString}: ${message}`);
        return;
    }
    console.log(`${dateString}: ${channel.id} - #${channel.name}\n${message}`)
};

export default log;
  
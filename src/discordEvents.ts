import { Guild, Message, Channel } from 'discord.js';
import log from './log';
import { login } from './discord';

export const handleMessage = async (message : Message) => {
    // Ignore bots
    if (message.author.bot) return;
    console.log(message);
  };
  

export const handleReady = () => {
    log('✅ Logged in to Discord');
};

export const handleError = ({ message }: Error) => {
    log(`Discord client encountered an error: ${message}`);
};  

export const handleGuildCreate = async ({ name } : Guild) => {
    log(`Joined guild ${name}`);
  };
  
export const handleGuildDelete = async ({ name }: Guild) => {
    log(`Left guild ${name}.`);
};

export const handleChannelDelete = async ({ id }: Channel) => {
  log(`Channel ${id} deleted.`);
};

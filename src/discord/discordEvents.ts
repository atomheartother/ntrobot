import { Guild, Message, Channel } from 'discord.js';
import log from '../utils/log';

export const handleMessage = async ({ content, author } : Message) : Promise<void> => {
  // Ignore bots
  if (author.bot) return;
  log(content);
};


export const handleReady = () : void => {
  log('✅ Logged in to Discord');
};

export const handleError = ({ message }: Error) : void => {
  log(`Discord client encountered an error: ${message}`);
};

export const handleGuildCreate = ({ name } : Guild) : void => {
  log(`Joined guild ${name}`);
};

export const handleGuildDelete = ({ name }: Guild) : void => {
  log(`Left guild ${name}.`);
};

export const handleChannelDelete = ({ id }: Channel) : void => {
  log(`Channel ${id} deleted.`);
};

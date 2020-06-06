import {
  Guild, Message, Channel, TextChannel,
} from 'discord.js';
import { getClient } from '.';
import log from '../utils/log';
import { ts } from '../send';

export const handleMessage = async ({
  content, author, channel, mentions,
} : Message) : Promise<void> => {
  // Ignore bots
  if (author.bot) return;
  const c = channel as TextChannel;
  // If somehow channel isn't a TextChannel, stop
  if (!c) return;
  // Find prefix
  const prefix = process.env.PREFIX;
  if (content.indexOf(prefix) !== 0) {
    if (mentions.has(getClient().user)) {
      // We've been mentioned, tell them what our prefix is
      ts(c, 'prefixUsage', { prefix });
      return;
    }
  }
  log(content, c);
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

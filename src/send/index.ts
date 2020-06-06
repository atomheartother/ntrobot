import { TextChannel, MessageEmbed, DiscordAPIError } from 'discord.js';
import i18n, { i18nOptions } from '../i18n';
import log from '../utils/log';
import handleError from './handleError';

export type BotMessage = MessageEmbed | string;

const send = async (channel : TextChannel, content: BotMessage) : Promise<number> => {
  try {
    await channel.send(content);
  } catch (e) {
    if (e instanceof DiscordAPIError) {
      return handleError(channel, e, content);
    }
    log('Got unknown error type', channel);
    log(e, channel);
  }
  return 0;
};

export const ts = (
  channel: TextChannel,
  key: string,
  options: i18nOptions = {},
) : Promise<number> => send(channel, i18n('en', key, options));

export const eb = (
  channel: TextChannel,
  content: MessageEmbed,
) : Promise<number> => send(channel, content);

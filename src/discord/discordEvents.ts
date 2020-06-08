import {
  Message, TextChannel, GuildMember, PartialGuildMember,
} from 'discord.js';
import { getClient } from '.';
import log from '../utils/log';
import { ts } from '../send';
import command from '../command';
import { memberAssignments, deleteMember } from '../db';

export const handleMessage = async (message : Message) : Promise<void> => {
  const {
    content, author, channel, mentions,
  } = message;
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
    return;
  }
  command(content.slice(prefix.length), c, message);
};

export const handleReady = () : void => {
  log('✅ Logged in to Discord');
};

export const handleError = ({ message }: Error) : void => {
  log(`Discord client encountered an error: ${message}`);
};


export const handleMemberRemove = async (
  { id, user, guild }: GuildMember | PartialGuildMember,
) : Promise<void> => {
  const assigned = await memberAssignments(id);
  await deleteMember(id);
  log(`${guild.name}: ${user.tag} has left. ${assigned.length} characters freed`);
};

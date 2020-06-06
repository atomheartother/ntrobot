import { TextChannel, Message } from 'discord.js';
import { getMemberFromMention, getRoleFromMention } from '../discord';
import { ts } from '../send';
import { CommandOptions } from '.';

const assign = (
  args: string[],
  channel: TextChannel,
  options : CommandOptions,
  message: Message,
) : void => {
  const roleStr = args.shift();
  const role = getRoleFromMention(channel.guild, roleStr);
  if (!role) {
    ts(channel, 'noSuchRole', { role: roleStr });
    return;
  }
  const memberStr = args.shift();
  const member = getMemberFromMention(channel.guild, memberStr);
  if (!member) {
    ts(channel, 'noSuchMember', { member: memberStr });
    return;
  }
  ts(channel, 'assignSuccess', { role: role.name, member: member.user.tag });
  message.delete();
};

export default assign;

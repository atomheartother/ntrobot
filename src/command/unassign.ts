import { TextChannel, Message } from 'discord.js';
import { getMemberFromMention, getRoleFromMention } from '../discord';
import { ts } from '../send';
import { CommandOptions } from '.';

const unassign = (
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
  if (!member.roles.cache.get(role.id)) {
    ts(channel, 'roleNotAssigned', { role: role.name, member: member.user.tag });
    return;
  }
  member.roles.remove(role);
  ts(channel, 'unassignSuccess', { role: role.name, member: member.user.tag });
  message.delete();
};

export default unassign;

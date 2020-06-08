import { TextChannel } from 'discord.js';
import { getMemberFromMention, getRoleFromMention } from '../discord';
import { ts } from '../send';
import { CommandOptions } from '.';
import { assignChar } from '../db';

const assign = (
  args: string[],
  channel: TextChannel,
  options : CommandOptions,
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
  const isShared = !!options.shared;
  assignChar(role.id, member.id, isShared);
  member.roles.add(role);
  if (!isShared) {
    ts(channel, 'assignSuccess', {
      role: role.id,
      roleName: role.name,
      member: member.user.tag,
    });
  } else {
    ts(channel, 'assignSharedSuccess', {
      role: role.id,
      roleName: role.name,
      member: member.user.tag,
    });
  }
  // message.delete();
};

export default assign;

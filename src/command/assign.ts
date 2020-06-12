import { TextChannel } from 'discord.js';
import { getMemberFromMention, getRoleFromMention, getRoleFromId } from '../discord';
import { ts } from '../send';
import { CommandOptions } from '.';
import { assignChar } from '../db';
import { getCharFromStr } from '../utils/getters';

const assign = async (
  args: string[],
  channel: TextChannel,
  options : CommandOptions,
) : Promise<void> => {
  const name = args.shift();
  const char = await getCharFromStr(name, channel.guild);
  if (!char) {
    ts(channel, 'noSuchChar', { name });
    return;
  }
  const memberStr = args.shift();
  const member = getMemberFromMention(channel.guild, memberStr);
  if (!member) {
    ts(channel, 'noSuchMember', { member: memberStr });
    return;
  }
  const isShared = !!(options.shared || options.share);
  assignChar(char.roleid, member.id, isShared);
  member.roles.add(char.roleid);
  if (!isShared) {
    ts(channel, 'assignSuccess', {
      role: char.roleid,
      member: member.user.tag,
    });
  } else {
    ts(channel, 'assignSharedSuccess', {
      role: char.roleid,
      member: member.user.tag,
    });
  }
  // message.delete();
};

export default assign;

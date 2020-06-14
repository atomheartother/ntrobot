import { TextChannel } from 'discord.js';
import { getMemberFromMention, getRoleFromMention } from '../discord';
import { ts } from '../send';
import { unassignChar } from '../db';
import { getCharFromStr } from '../utils/getters';

const unassign = async (
  channel: TextChannel,
  args: string[],
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
  if (!member.roles.cache.get(char.roleid)) {
    ts(channel, 'roleNotAssigned', { role: char.roleid, member: member.user.tag });
    return;
  }
  unassignChar(char.roleid, member.id);
  member.roles.remove(char.roleid);
  ts(channel, 'unassignSuccess', { role: char.roleid, member: member.user.tag });
  // message.delete();
};

export default unassign;

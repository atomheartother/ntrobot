import { ts } from '../send';
import { unassignChar } from '../db';
import { CommandCallback } from './type';

const unassign : CommandCallback<'unassign'> = async (
  channel,
  [char, member],
) : Promise<void> => {
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

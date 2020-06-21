import { ts } from '../send';
import { CommandCallback } from './type';
import { assignChar } from '../db';

const assign :CommandCallback<'assign'> = async (
  channel,
  [char, member],
  options,
) : Promise<void> => {
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

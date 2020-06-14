import { TextChannel } from 'discord.js';
import { ts } from '../send';
import { CommandOptions, FunctionParams } from './type';
import { assignChar } from '../db';

const assign = async (
  channel: TextChannel,
  [char, member]: FunctionParams<'assign'>,
  options : CommandOptions,
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

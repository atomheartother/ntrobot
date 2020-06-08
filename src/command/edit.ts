import { TextChannel, Message } from 'discord.js';
import { CommandOptions } from '.';
import { getRoleFromMention, getMemberFromId } from '../discord';
import { ts, eb } from '../send';
import { roleAssignments, getCharacter, editCharacter } from '../db';
import permisssionList from './perms';
import { characterEmbed } from './show';

const edit = async (
  args: string[],
  channel: TextChannel,
  options: CommandOptions,
  message: Message,
) : Promise<void> => {
  const roleStr = args.shift();
  const role = getRoleFromMention(channel.guild, roleStr);
  if (!role) {
    ts(channel, 'noSuchRole', { role: roleStr });
    return;
  }
  const char = await getCharacter(role.id);
  // Staff can edit a character,
  // and so can the owner of a character
  const member = getMemberFromId(channel.guild, message.author.id);
  if (!permisssionList.manageRoles(member, channel)) {
    const members = await roleAssignments(role.id);
    const index = members.findIndex(({ memberid }) => (memberid === member.id));
    if (index === -1) {
      ts(channel, 'cannotEdit', { name: char.name || role.name });
      return;
    }
  }
  if (options.name) {
    char.name = options.name as string;
  }
  if (options.description) {
    char.description = args.join(' ');
  }
  if (message.attachments.first()) {
    const { url } = message.attachments.first();
    char.avatar = url;
  }
  editCharacter(char);
  eb(channel, { embed: characterEmbed(char, role) });
};

export default edit;

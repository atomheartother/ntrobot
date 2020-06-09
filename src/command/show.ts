import { TextChannel, Role, MessageEmbed } from 'discord.js';
import { getCharacter, roleAssignments } from '../db';
import { getRoleFromMention, getMemberFromId } from '../discord';
import { Character } from '../db/characters';
import { ts, eb } from '../send';
import i18n from '../i18n';

export const characterEmbed = (char: Character | null, role: Role) : MessageEmbed => {
  const embed = new MessageEmbed()
    .setAuthor((char && char.name) || role.name)
    .setColor(role.color);
  if (char && char.avatar) {
    embed.setThumbnail(char.avatar);
  }
  embed.setDescription(char && char.description && char.description.length > 0 ? char.description : 'No description available');
  return embed;
};

const check = async (
  args: string[],
  channel: TextChannel,
) : Promise<void> => {
  const roleStr = args.shift();
  const role = getRoleFromMention(channel.guild, roleStr);
  if (!role) {
    ts(channel, 'noSuchRole', { role: roleStr });
    return;
  }
  const language = 'en';
  const memberList = await roleAssignments(role.id);
  if (memberList.length < 1) {
    ts(channel, 'unownedChar', { name: role.name });
    return;
  }
  const char = await getCharacter(role.id);
  const embed = characterEmbed(char, role);
  memberList.forEach(({ memberid, shared }) => {
    const member = getMemberFromId(channel.guild, memberid);
    embed.addField(`${member.user.tag} (${member.id})`, i18n(language, shared ? 'sharedCharacter' : 'mainCharacter'));
  });
  eb(channel, { embed });
};

export default check;

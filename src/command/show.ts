import { Role, MessageEmbed } from 'discord.js';
import { roleAssignments } from '../db';
import { getMemberFromId, getRoleFromId } from '../discord';
import { Character } from '../db/characters';
import { eb } from '../send';
import i18n from '../i18n';
import { CommandCallback } from './type';

export const characterEmbed = (char: Character | null, role: Role) : MessageEmbed => {
  const language = 'en';
  const embed = new MessageEmbed()
    .setAuthor((char && char.name) || role.name)
    .setColor(role.color);
  if (char && char.avatar) {
    embed.setThumbnail(char.avatar);
  }
  embed.setDescription(char && char.description && char.description.length > 0 ? char.description : i18n(language, 'noDescription'));
  return embed;
};

const show : CommandCallback<'show'> = async (
  channel,
  [char],
) : Promise<void> => {
  const language = 'en';
  const memberList = await roleAssignments(char.roleid);
  const role = getRoleFromId(channel.guild, char.roleid);
  const embed = characterEmbed(char, role);
  memberList.forEach(({ memberid, shared }) => {
    const member = getMemberFromId(channel.guild, memberid);
    embed.addField(`${member.user.tag} (${member.id})`, i18n(language, shared ? 'sharedCharacter' : 'mainCharacter'));
  });
  if (memberList.length < 1) {
    embed.addField(i18n(language, 'unownedCharTitle'), i18n(language, 'unownedCharBody'));
  }
  eb(channel, { embed });
};

export default show;

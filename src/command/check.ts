import { Role, MessageEmbed, GuildMember } from 'discord.js';
import { roleAssignments, unassignChar } from '../db';
import { getMemberFromId, getRoleFromId } from '../discord';
import { Character } from '../db/characters';
import { eb } from '../send';
import i18n from '../i18n';
import { CommandCallback } from './type';
import log from '../utils/log';
import { AssignedColumns } from '../db/assigned';
import { paginatedEmbedWithFormat } from '../discord/paginatedEmbed';

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

const check : CommandCallback<'check'> = async (
  channel,
  [char],
) : Promise<void> => {
  const language = 'en';
  const memberList = await roleAssignments(char.roleid);
  const role = getRoleFromId(channel.guild, char.roleid);
  const formatEmbed = async (pageData: AssignedColumns[]): Promise<MessageEmbed> => {
    const embed = characterEmbed(char, role);
    const promises = pageData.map(({ memberid }) => getMemberFromId(channel.guild, memberid));
    const members = await Promise.all(promises);
    pageData.forEach(({ memberid, shared }, idx) => {
      const member = members[idx];
      if (member) { // Not displayed in the tags, but you can have a non-existent member in your ids
        embed.addField(`${member.user.tag} (${member.id})`, i18n(language, shared ? 'sharedCharacter' : 'mainCharacter'));
      } else {
        log(`Member ${memberid} can't be found on ${char.roleid}. Unassigning.`);
        unassignChar(char.roleid, memberid);
      }
    });
    if (embed.fields.length < 1) {
      embed.addField(i18n(language, 'unownedCharTitle'), i18n(language, 'unownedCharBody'));
    }
    return embed;
  };
  const pages: AssignedColumns[][] = [];
  if (memberList.length === 0) {
    pages.push([]);
  } else {
    while (memberList.length) {
      pages.push(memberList.splice(0, 5));
    }
  }
  paginatedEmbedWithFormat<AssignedColumns[]>(channel, pages, formatEmbed);
};

export default check;

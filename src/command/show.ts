import { TextChannel, Role, MessageEmbed } from 'discord.js';
import { roleAssignments } from '../db';
import { getMemberFromId, getRoleFromId } from '../discord';
import { Character } from '../db/characters';
import { ts, eb } from '../send';
import i18n from '../i18n';
import { getCharFromStr } from '../utils/getters';

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
  const name = args.shift();
  const char = await getCharFromStr(name, channel.guild);
  if (!char) {
    ts(channel, 'noSuchChar', { name });
    return;
  }
  const language = 'en';
  const memberList = await roleAssignments(char.roleid);
  if (memberList.length < 1) {
    ts(channel, 'unownedChar', { role: char.roleid });
    return;
  }
  const role = getRoleFromId(channel.guild, char.roleid);
  const embed = characterEmbed(char, role);
  memberList.forEach(({ memberid, shared }) => {
    const member = getMemberFromId(channel.guild, memberid);
    embed.addField(`${member.user.tag} (${member.id})`, i18n(language, shared ? 'sharedCharacter' : 'mainCharacter'));
  });
  eb(channel, { embed });
};

export default check;

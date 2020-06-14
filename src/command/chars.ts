import { MessageEmbed, TextChannel } from 'discord.js';
import { getMemberFromMention, getRoleFromId } from '../discord';
import { ts, eb } from '../send';
import i18n from '../i18n';
import { memberAssignments } from '../db';
import { FunctionParams } from './type';

const chars = async (
  channel: TextChannel,
  [member]: FunctionParams<'chars'>,
) : Promise<void> => {
  const language = 'en';
  const charList = await memberAssignments(member.id);
  if (charList.length < 1) {
    ts(channel, 'memberHasNoChars', { name: member.user.tag });
    return;
  }
  const embed = new MessageEmbed()
    .setAuthor(member.user.tag)
    .setThumbnail(member.user.avatarURL())
    .setColor(member.displayColor);
  charList.forEach(({ roleid, shared }) => {
    const role = getRoleFromId(channel.guild, roleid);
    embed.addField(`${role.name} (${role.id})`, i18n(language, shared ? 'sharedCharacter' : 'mainCharacter'));
  });
  eb(channel, { embed });
};

export default chars;

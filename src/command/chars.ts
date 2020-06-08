import { MessageEmbed, TextChannel } from 'discord.js';
import { getMemberFromMention, getRoleFromId } from '../discord';
import { ts, eb } from '../send';
import { getCharsFromMemberId } from '../db/assigned';
import i18n from '../i18n';

const chars = async (
  args: string[],
  channel: TextChannel,
) : Promise<void> => {
  const memberStr = args.shift();
  const member = getMemberFromMention(channel.guild, memberStr);
  if (!member) {
    ts(channel, 'noSuchMember', { member: memberStr });
  }
  const language = 'en';
  const charList = await getCharsFromMemberId(member.id);
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
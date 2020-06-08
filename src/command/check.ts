import { MessageEmbed, TextChannel } from 'discord.js';
import { getMemberFromId, getRoleFromMention } from '../discord';
import { ts, eb } from '../send';
import i18n from '../i18n';
import { roleAssignments } from '../db';

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
  const embed = new MessageEmbed()
    .setAuthor(role.name)
    .setColor(role.color);
  memberList.forEach(({ memberid, shared }) => {
    const member = getMemberFromId(channel.guild, memberid);
    embed.addField(`${member.user.tag} (${member.id})`, i18n(language, shared ? 'sharedCharacter' : 'mainCharacter'));
  });
  eb(channel, { embed });
};

export default check;

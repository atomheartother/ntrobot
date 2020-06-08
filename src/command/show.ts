import { TextChannel, Role, MessageEmbed } from 'discord.js';
import { getCharacter } from '../db';
import { getRoleFromMention } from '../discord';
import { Character } from '../db/characters';
import { ts, eb } from '../send';

export const characterEmbed = (char: Character, role: Role) : MessageEmbed => {
  const embed = new MessageEmbed()
    .setAuthor(char.name || role.name)
    .setColor(role.color);
  if (char.avatar) {
    embed.setThumbnail(char.avatar);
  }
  if (char.description) {
    embed.setDescription(char.description || 'No description available');
  }
  return embed;
};

const show = async (
  args: string[],
  channel: TextChannel,
) : Promise<void> => {
  const roleStr = args.shift();
  const role = getRoleFromMention(channel.guild, roleStr);
  if (!role) {
    ts(channel, 'noSuchRole', { role: roleStr });
    return;
  }
  const char = await getCharacter(role.id);
  eb(channel, { embed: characterEmbed(char, role) });
};

export default show;

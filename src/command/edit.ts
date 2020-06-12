import { TextChannel, Message } from 'discord.js';
import { CommandOptions } from '.';
import { getRoleFromId } from '../discord';
import { ts, eb } from '../send';
import { editCharacter } from '../db';
import { characterEmbed } from './show';
import { getCharFromStr } from '../utils/getters';

const edit = async (
  args: string[],
  channel: TextChannel,
  options: CommandOptions,
  message: Message,
) : Promise<void> => {
  const name = args.shift();
  const char = await getCharFromStr(name, channel.guild);
  if (!char) {
    ts(channel, 'noSuchChar', { name });
    return;
  }
  if (options.name) {
    char.name = options.name as string;
  }
  const descriptionOption = options.description || options.describe || options.desc;
  if (descriptionOption) {
    char.description = args.join(' ');
  }
  if (message.attachments.first()) {
    const { url } = message.attachments.first();
    char.avatar = url;
  }
  editCharacter(char);
  const role = await getRoleFromId(channel.guild, char.roleid);
  eb(channel, { embed: characterEmbed(char, role) });
};

export default edit;

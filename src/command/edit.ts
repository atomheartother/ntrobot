import { CommandCallback } from './type';
import { getRoleFromId } from '../discord';
import { eb } from '../send';
import { editCharacter } from '../db';
import { characterEmbed } from './show';

const edit : CommandCallback<'edit'> = async (
  channel,
  [char, rest],
  options,
  message,
) : Promise<void> => {
  const newChar = { ...char };
  if (options.name) {
    newChar.name = options.name as string;
  }
  const descriptionOption = options.description
  || options.describe
  || options.desc
  || options.described;
  if (descriptionOption) {
    const [, ...otherLines] = message.content.split('\n');
    newChar.description = `${rest.join(' ')}\n${otherLines.join('\n')}`;
  }
  if (message.attachments.first()) {
    const { url } = message.attachments.first();
    newChar.avatar = url;
  }
  await editCharacter(newChar);
  const role = getRoleFromId(channel.guild, char.roleid);
  eb(channel, { embed: characterEmbed(char, role) });
};

export default edit;

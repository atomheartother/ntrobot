import { MessageEmbed } from 'discord.js';
import { eb } from '../send';
import i18n from '../i18n';
import { CommandCallback } from './type';

const help : CommandCallback<'help'> = async (channel) : Promise<void> => {
  const prefix = process.env.PREFIX;
  const language = 'en';
  const embed = new MessageEmbed()
    .setColor(0x0e7675)
    .setTitle(i18n(language, 'helpHeader'))
    .setDescription(i18n(language, 'helpIntro'))
    .addField(`${prefix}chars`, i18n(language, 'usage-chars'))
    .addField(`${prefix}assign`, i18n(language, 'usage-assign'))
    .addField(`${prefix}unassign`, i18n(language, 'usage-unassign'))
    .addField(`${prefix}check`, i18n(language, 'usage-check'))
    .addField(`${prefix}edit`, i18n(language, 'usage-edit'));
  eb(channel, { embed });
};

export default help;

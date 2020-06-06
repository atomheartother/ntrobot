import { TextChannel, MessageEmbed } from 'discord.js';
import { eb } from '../send';
import i18n from '../i18n';

const help = (args: string[], channel: TextChannel) : void => {
  const prefix = process.env.PREFIX;
  const language = 'en';
  const embed = new MessageEmbed()
    .setColor(0x0e7675)
    .setTitle(i18n(language, 'helpHeader'))
    .setDescription(i18n(language, 'helpIntro'))
    .addField(`${prefix}chars`, i18n(language, 'usage-chars'));
  eb(channel, { embed });
};

export default help;

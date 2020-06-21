import { CommandCallback } from './type';
import { getGuildInfo, setGuildInfo } from '../db';
import { ts } from '../send';

const announce : CommandCallback<'announce'> = async (
  channel,
  [targetChannel],
) : Promise<void> => {
  if (targetChannel.type !== 'text') {
    ts(channel, 'notTextChannel', { channel: targetChannel.id });
    return;
  }
  let guildInfo = await getGuildInfo(channel.guild.id);
  if (!guildInfo) {
    guildInfo = {
      lang: null,
      prefix: null,
      announce: null,
    };
  }
  guildInfo.announce = targetChannel.id;
  await setGuildInfo(
    channel.guild.id,
    guildInfo.lang,
    guildInfo.prefix,
    guildInfo.announce,
  );
  ts(channel, 'announceSuccess', { channel: targetChannel.id });
};

export default announce;

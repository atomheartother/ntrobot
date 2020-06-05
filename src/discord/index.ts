// Direct mappings for js methods
import { Client, TextChannel, Permissions } from 'discord.js';
import Backup from './Backup';
import log from './log';

const dClient = new Client({
  messageCacheMaxSize: 1,
  messageCacheLifetime: 30,
  messageSweepInterval: 60,
});

const reconnectionDelay = new Backup({
  mode: 'exponential',
  startValue: 1000,
  maxValue: 60000,
});

export const getClient = () => dClient;

export const login = async () => {
  try {
    log('⚙️ Logging into Discord');
    await dClient.login(process.env.DISCORD_TOKEN);
    reconnectionDelay.reset();
  } catch (err) {
    log("Couldn't log into discord:");
    log(err);
    setTimeout(login, reconnectionDelay.value());
    reconnectionDelay.increment();
  }
};

export const user = () => dClient.user;

export const getChannel = (id: string) => dClient.channels.resolve(id);

export const getGuild = (id: string) => dClient.guilds.resolve(id);

export const getUser = (id: string) => dClient.users.resolve(id);

export const getUserDm = async (id: string) => {
  const usr = dClient.users.resolve(id);
  if (!usr) return null;
  return usr.dmChannel ? usr.dmChannel : usr.createDM();
};

export const canPostIn = (channel: TextChannel) => {
  if (!channel) return false;
  const permissions = channel.permissionsFor(dClient.user);
  return (
    permissions.has(Permissions.FLAGS.SEND_MESSAGES)
    && permissions.has(Permissions.FLAGS.VIEW_CHANNEL)
  );
};

export const canPostEmbedIn = (channel: TextChannel) => {
  if (!channel) return false;
  const permissions = channel.permissionsFor(dClient.user);
  return (
    permissions.has(Permissions.FLAGS.SEND_MESSAGES)
    && permissions.has(Permissions.FLAGS.VIEW_CHANNEL)
    && permissions.has(Permissions.FLAGS.EMBED_LINKS)
    && permissions.has(Permissions.FLAGS.ATTACH_FILES)
  );
};

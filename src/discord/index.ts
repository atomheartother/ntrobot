// Direct mappings for js methods
import {
  Client, Permissions, ClientUser, Guild, User, DMChannel, Channel, TextChannel,
} from 'discord.js';
import Backup from '../utils/Backup';
import log from '../utils/log';

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

export const getClient = () : Client => dClient;

export const login = async () : Promise<void> => {
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

export const user = () : ClientUser => dClient.user;

export const getChannel = (id: string) : Channel => dClient.channels.resolve(id);

export const getGuild = (id: string) : Guild => dClient.guilds.resolve(id);

export const getUser = (id: string) : User => dClient.users.resolve(id);

export const getUserDm = async (id: string) : Promise<DMChannel> => {
  const usr = dClient.users.resolve(id);
  if (!usr) return null;
  return usr.dmChannel ? usr.dmChannel : usr.createDM();
};

export const canPostIn = (channel: TextChannel) : boolean => {
  if (!channel) return false;
  const permissions = channel.permissionsFor(dClient.user);
  return (
    permissions.has(Permissions.FLAGS.SEND_MESSAGES)
    && permissions.has(Permissions.FLAGS.VIEW_CHANNEL)
  );
};

export const canPostEmbedIn = (channel: TextChannel) : boolean => {
  if (!channel) return false;
  const permissions = channel.permissionsFor(dClient.user);
  return (
    permissions.has(Permissions.FLAGS.SEND_MESSAGES)
    && permissions.has(Permissions.FLAGS.VIEW_CHANNEL)
    && permissions.has(Permissions.FLAGS.EMBED_LINKS)
    && permissions.has(Permissions.FLAGS.ATTACH_FILES)
  );
};

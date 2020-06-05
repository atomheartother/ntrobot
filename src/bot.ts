import { login, getClient } from './discord';
import {
    handleMessage,
    handleError,
    handleGuildCreate,
    handleGuildDelete,
    handleReady,
    handleChannelDelete,
  } from './discordEvents';
  
  const start = async () => {
    // Init DB here
    getClient()
    .on('message', handleMessage)
    .on('error', handleError)
    .on('guildCreate', handleGuildCreate)
    .on('guildDelete', handleGuildDelete)
    .on('ready', handleReady)
    .on('channelDelete', handleChannelDelete);

    login();
}

start();

import { login, getClient } from './discord';
import {
  handleMessage,
  handleError,
  handleReady,
  handleMemberRemove,
} from './discord/discordEvents';

const start = async () => {
  // Init DB here
  getClient()
    .on('message', handleMessage)
    .on('error', handleError)
    .on('ready', handleReady)
    .on('guildMemberRemove', handleMemberRemove);
  login();
};

start();

import { TextChannel, Message } from 'discord.js';
import permisssionList, { Permission } from './perms';
import help from './help';
import assign from './assign';
import unassign from './unassign';
import chars from './chars';
import { ts } from '../send';
import show from './show';
import edit from './edit';

import { getMemberFromId } from '../discord';

type BotCommand = 'help' | 'unassign' | 'assign' | 'chars' | 'show' | 'edit';

export type CommandOptions = {
    [key:string] : (string | boolean);
}

type CommandDefinition = {
    f: (channel: TextChannel, args: string[], options : CommandOptions, message: Message) => void;
    perms: Permission[],
    minArgs: number;
    sendString?: boolean;
    aliases?: string[];
};

const CmdList : {
    [key in BotCommand]: CommandDefinition
} = {
  help: {
    f: help,
    perms: [],
    minArgs: 0,
    aliases: ['h', '?'],
  },
  assign: {
    f: assign,
    perms: ['manageRoles'],
    minArgs: 2,
    aliases: ['a', 'give'],
  },
  unassign: {
    f: unassign,
    perms: ['characterOwner'],
    minArgs: 2,
    aliases: ['u', 'un', 'remove'],
  },
  chars: {
    f: chars,
    perms: [],
    minArgs: 1,
    aliases: ['c', 'char', 'characters'],
  },
  show: {
    f: show,
    perms: [],
    minArgs: 1,
    aliases: ['s', 'display', 'profile', 'describe', 'members', 'owned', 'check'],
  },
  edit: {
    f: edit,
    perms: ['characterOwner'],
    minArgs: 1,
    aliases: ['e', 'modify', 'set', 'register'],
  },
};

const getCmdFromWord = (word : string) : BotCommand => {
  if (CmdList[word as BotCommand]) return word as BotCommand;
  for (let i = 0; i < Object.keys(CmdList).length; i += 1) {
    const key = Object.keys(CmdList)[i];
    if (CmdList[key as BotCommand].aliases.indexOf(word) !== -1) return key as BotCommand;
  }
  return null;
};

const parseWords = (line: string) : {args: string[], options: CommandOptions} => {
  const args : string[] = [];
  const options : CommandOptions = {};
  const regxp = /--(\w+)(="(.*?)"|=(\S+))?|"(.*?)"|(\S+)/g;
  let match = regxp.exec(line);
  while (match) {
    if (match[6] || match[5]) { // Single word or multiple word arg
      args.push(match[6] || match[5]);
    } else if (match[1] && !match[2]) { // Option with no equal
      options[match[1]] = true;
    } else {
      const key = match[1];
      const value = match[3] || match[4]; // Multiple word value or simple value
      options[key] = value;
    }
    match = regxp.exec(line);
  }
  return { args, options };
};

// The entrypoint for all commands
const runCommand = (content : string, channel : TextChannel, message: Message) : void => {
  // Get the first line, which should hold the actual command
  const lines = content.split(/\n+/);
  if (lines.length < 1) return;
  const words = lines.shift().split(/ +/);
  const firstWord = words.shift();
  const verb = getCmdFromWord(firstWord);
  if (!verb) return;
  const cmd = CmdList[verb];

  // Check permissions
  const member = getMemberFromId(channel.guild, message.author.id);
  for (let i = 0; i < Object.values(cmd.perms).length; i += 1) {
    const perm = Object.values(cmd.perms)[i];
    if (!permisssionList[perm](member, words)) {
      ts(channel, `${perm}PermFail`, { command: verb });
      return;
    }
  }

  // Parse the args provided
  const { args, options } = parseWords(words.join(' '));
  // Check number of args
  if (args.length < cmd.minArgs) {
    ts(channel, `usage-${verb}`, { cmd: verb, minArgs: cmd.minArgs });
    return;
  }
  const commandArgs = args.concat('\n', lines.join('\n'));
  // Run the command, recombining the lines from before
  cmd.f(channel, commandArgs, options, message);
};

export default runCommand;

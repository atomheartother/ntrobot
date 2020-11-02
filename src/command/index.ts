import { TextChannel, Message } from 'discord.js';
import permisssionList from './perms';
import argumentParser, { PossibleArgumentResults } from './args';
import help from './help';
import assign from './assign';
import unassign from './unassign';
import chars from './chars';
import { ts } from '../send';
import check from './check';
import edit from './edit';
import announce from './announce';

import { getMemberFromId } from '../discord';
import {
  BotCommand, CommandDefinition, CommandOptions, FunctionParams,
} from './type';

const CmdList : {
    [key in BotCommand]: CommandDefinition<key>
} = {
  help: {
    f: help,
    perms: [],
    args: [],
    minArgs: 0,
    aliases: ['h'],
  },
  assign: {
    f: assign,
    perms: ['manageRoles'],
    args: ['char', 'member'],
    minArgs: 2,
    aliases: ['a', 'give'],
  },
  unassign: {
    f: unassign,
    perms: ['characterOwner'],
    args: ['char', 'member'],
    minArgs: 2,
    aliases: ['u', 'un', 'remove'],
  },
  chars: {
    f: chars,
    perms: [],
    args: ['member'],
    minArgs: 1,
    aliases: ['c', 'char', 'characters'],
  },
  check: {
    f: check,
    perms: [],
    args: ['char'],
    minArgs: 1,
    aliases: ['s', 'display', 'profile', 'describe', 'members', 'owned', 'show'],
  },
  edit: {
    f: edit,
    perms: ['characterOwner'],
    args: ['char', 'rest'],
    minArgs: 1,
    aliases: ['e', 'modify', 'set', 'register'],
  },
  announce: {
    f: announce,
    perms: ['isAdmin'],
    args: ['channel'],
    minArgs: 0,
  },
};

const getCmdFromWord = (word : string) : BotCommand => {
  if (CmdList[word as BotCommand]) return word as BotCommand;
  for (let i = 0; i < Object.keys(CmdList).length; i += 1) {
    const key = Object.keys(CmdList)[i] as BotCommand;
    const cmd = CmdList[key];
    if (cmd.aliases && cmd.aliases.indexOf(word) !== -1) return key;
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
const runCommand = async (
  content : string,
  channel : TextChannel,
  message: Message,
) : Promise<void> => {
  // Get the first line, which should hold the actual command
  const [firstLine] = content.split('\n');
  if (!firstLine) return;
  const [firstWord, ...words] = firstLine.split(/ +/);
  const verb = getCmdFromWord(firstWord);
  if (!verb) return;
  const cmd : CommandDefinition<typeof verb> = CmdList[verb];

  // Check permissions
  const member = await getMemberFromId(channel.guild, message.author.id);
  const passes = await Promise.all(cmd.perms.map((perm) => permisssionList[perm](member, words)));

  for (let i = 0; i < passes.length; i += 1) {
    const pass = passes[i];
    if (!pass) {
      ts(channel, `${cmd.perms[i]}PermFail`, { command: verb });
      return;
    }
  }

  // Parse the args provided
  const { args, options } = parseWords(words.join(' '));
  if (args.length < cmd.minArgs) {
    ts(channel, `usage-${verb}`, { cmd: verb });
    return;
  }
  const commandArgs = await Promise.all<PossibleArgumentResults>(
    cmd.args.map(
      (arg, i) => argumentParser[arg](channel, args[i], args, i),
    ),
  );
  // Check args
  if (commandArgs.findIndex((arg) => !arg) !== -1) return;
  // Run the command, recombining the lines from before
  cmd.f(channel, commandArgs as FunctionParams<typeof verb>, options, message);
};

export default runCommand;

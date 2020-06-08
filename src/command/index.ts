import { TextChannel, Message } from 'discord.js';
import permisssionList, { Permission } from './perms';
import help from './help';
import assign from './assign';
import unassign from './unassign';
import chars from './chars';
import { ts } from '../send';
import { getMemberFromId } from '../discord';

type BotCommand = 'help' | 'unassign' | 'assign' | 'chars';

export type CommandOptions = {
    [key:string] : (string | boolean);
}

type CommandDefinition = {
    f: (args: string[], channel: TextChannel, options : CommandOptions, message: Message) => void;
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
    perms: ['manageRoles'],
    minArgs: 2,
    aliases: ['u', 'un', 'remove'],
  },
  chars: {
    f: chars,
    perms: [],
    minArgs: 1,
    aliases: ['c', 'char', 'characters'],
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

const parseWords = (words: string[]) : {args: string[], options: CommandOptions} => {
  const args : string[] = [];
  const options : CommandOptions = {};
  for (let i = 0; i < words.length; i += 1) {
    const w = words[i];
    if (w.indexOf('--') === 0) {
      const option = w.slice(2).split('=');
      if (option.length === 1) {
        options[option[0]] = true;
      } else if (option.length === 2) {
        const [key, value] = option;
        options[key] = value;
      }
    } else {
      args.push(w);
    }
  }
  return { args, options };
};

// The entrypoint for all commands
const runCommand = (content : string, channel : TextChannel, message: Message) : void => {
  // Get the command
  const words = content.split(/ +/);
  const firstWord = words.shift();
  const verb = getCmdFromWord(firstWord);
  if (!verb) return;
  const cmd = CmdList[verb];

  // Check permissions
  const member = getMemberFromId(channel.guild, message.author.id);
  for (let i = 0; i < Object.values(cmd.perms).length; i += 1) {
    const perm = Object.values(cmd.perms)[i] as Permission;
    if (!permisssionList[perm](member, channel)) {
      ts(channel, `${perm}PermFail`, { command: verb });
      return;
    }
  }

  // Run the command
  const { args, options } = parseWords(words);
  // Check number of args
  if (args.length < cmd.minArgs) {
    ts(channel, `usage-${verb}`, { cmd: verb, minArgs: cmd.minArgs });
    return;
  }
  cmd.f(args, channel, options, message);
};

export default runCommand;

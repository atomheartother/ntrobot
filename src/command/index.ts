import { TextChannel, Message } from 'discord.js';
import { Permission } from './perms';
import help from './help';
import assign from './assign';
import unassign from './unassign';
import { ts } from '../send';

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
    [key:string]: CommandDefinition
} = {
  help: {
    f: help,
    perms: [],
    minArgs: 0,
    aliases: ['h', '?'],
  },
  assign: {
    f: assign,
    perms: [],
    minArgs: 2,
    aliases: ['a', 'give'],
  },
  unassign: {
    f: unassign,
    perms: [],
    minArgs: 2,
    aliases: ['u', 'un', 'remove'],
  },
};

const getCmdFromWord = (word : string) : string => {
  if (CmdList[word]) return word;
  for (let i = 0; i < Object.keys(CmdList).length; i += 1) {
    const key = Object.keys(CmdList)[i];
    if (CmdList[key].aliases.indexOf(word) !== -1) return key;
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

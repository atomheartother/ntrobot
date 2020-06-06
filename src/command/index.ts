import { TextChannel, User } from 'discord.js';
import { Permission } from './perms';
import help from './help';

type CommandDefinition = {
    f: (args: (string | string[]), channel: TextChannel, author: User) => void;
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
};

const getCmdFromWord = (word : string) : CommandDefinition => {
  if (CmdList[word]) return CmdList[word];
  for (let i = 0; i < Object.keys(CmdList).length; i += 1) {
    const key = Object.keys(CmdList)[i];
    if (CmdList[key].aliases.indexOf(word) !== -1) return CmdList[key];
  }
  return null;
};

// The entrypoint for all commands
const runCommand = (content : string, channel : TextChannel, author : User) : void => {
  // Get the command
  const words = content.split(/ +/);
  const firstWord = words.shift();
  const cmd = getCmdFromWord(firstWord);
  if (!cmd) return;

  // Check permissions

  // Run the command
  cmd.f(words, channel, author);
};

export default runCommand;

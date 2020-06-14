import { TextChannel, GuildMember } from 'discord.js';
import { Character } from '../db/characters';
import { getCharFromStr } from '../utils/getters';
import { ts } from '../send';
import { getMemberFromMention } from '../discord';

// We export our argument strings as well as every type that can result from them
export type Argument = 'char' | 'all' | 'rest' | 'member' | 'string';
export type PossibleArgumentResults = Character | string[] | GuildMember | string;

// This table associates string literal types with argument parsing results
export type ArgumentResult<T extends Argument> =
    T extends 'char' ? Character :
    T extends 'all' ? string[] :
    T extends 'member' ? GuildMember :
    T extends 'rest' ? string[] :
    string;

type ParseArgumentFunction<T extends Argument> = (
    channel: TextChannel, str: string, allArgs: string[], index: number,
) => Promise<ArgumentResult<T>>;

const char : ParseArgumentFunction<'char'> = async (channel, name) => {
  const res = await getCharFromStr(name, channel.guild);
  if (!res) {
    ts(channel, 'noSuchChar', { name });
  }
  return res;
};

const member : ParseArgumentFunction<'member'> = async (channel, name) => {
  const res = getMemberFromMention(channel.guild, name);
  if (!res) {
    ts(channel, 'noSuchMember', { member: name });
  }
  return res;
};

const all : ParseArgumentFunction<'all'> = async (channel, str, allArgs) => allArgs;
const rest : ParseArgumentFunction<'rest'> = async (channel, str, allArgs, i) => allArgs.slice(i);
const string : ParseArgumentFunction<'string'> = async (channel, str) => str;

const argumentParser : {
    [key in Argument] : ParseArgumentFunction<key>
} = {
  char,
  all,
  rest,
  string,
  member,
};

export default argumentParser;

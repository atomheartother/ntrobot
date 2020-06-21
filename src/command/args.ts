import { TextChannel, GuildMember, Channel } from 'discord.js';
import { Character } from '../db/characters';
import { getCharFromStr } from '../utils/getters';
import { ts } from '../send';
import { getMemberFromMention, getChannelFromMention } from '../discord';

// We export our argument strings as well as every type that can result from them
export type Argument =
  'char'
  | 'all'
  | 'rest'
  | 'member'
  | 'string'
  | 'channel';
export type PossibleArgumentResults = Character | string[] | GuildMember | string | Channel;

// This table associates string literal types with argument parsing results
export type ArgumentResult<T extends Argument> =
    T extends 'char' ? Character :
    T extends 'all' ? string[] :
    T extends 'member' ? GuildMember :
    T extends 'rest' ? string[] :
    T extends 'channel' ? Channel :
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

const getChannel : ParseArgumentFunction<'channel'> = async (channel, name) => {
  const res = getChannelFromMention(channel.guild, name);
  if (!res) {
    ts(channel, 'noSuchChannel', { name });
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
  channel: getChannel,
};

export default argumentParser;

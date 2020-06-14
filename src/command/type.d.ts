import { TextChannel, Message, GuildMember } from 'discord.js';
import { Character } from '../db/characters';
import { Permission } from './perms';
import { Argument } from './args';

export type BotCommand = 'help' | 'unassign' | 'assign' | 'chars' | 'show' | 'edit';

export type CommandOptions = {
    [key:string] : (string | boolean);
}

export type FunctionParams<T extends BotCommand> =
  T extends 'help' ? null :
  T extends 'show' ? [Character] :
  T extends 'chars' ? [GuildMember] :
  T extends 'edit' ? [Character, string[]] :
  T extends 'assign' ? [Character, GuildMember] :
  T extends 'unassign' ? [Character, GuildMember] :
  string[];

type CommandDefinition<T extends BotCommand> = {
    f: (channel: TextChannel,
        args: FunctionParams<T>,
        options : CommandOptions,
        message: Message) => void;
    perms: Permission[],
    args: Argument[],
    minArgs: number,
    aliases?: string[];
};

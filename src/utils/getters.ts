import { Guild } from 'discord.js';
import { Character } from '../db/characters';
import { getCharacter } from '../db';
import { getRoleFromMention } from '../discord';

export const getCharFromStr = async (charStr: string, guild: Guild) : Promise<Character> => {
  const role = getRoleFromMention(guild, charStr);
  if (role) {
    return getCharacter(role.id);
  }
  return null;
};

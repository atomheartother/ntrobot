import { Guild } from 'discord.js';
import { Character } from '../db/characters';
import { getCharacter, createCharacter } from '../db';
import { getRoleFromMention } from '../discord';

// eslint-disable-next-line import/prefer-default-export
export const getCharFromStr = async (charStr: string, guild: Guild) : Promise<Character> => {
  const role = getRoleFromMention(guild, charStr);
  if (role) {
    // We have a role. Check if there's a character assigned to it
    // And if not, create it.
    const char = await getCharacter(role.id);
    if (char) return char;
    await createCharacter(role.id);
    return getCharacter(role.id);
  }
  return null;
};

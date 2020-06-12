import { Guild } from 'discord.js';
import { Character } from '../db/characters';
import { getCharacter, createCharacter } from '../db';
import { getRoleFromMention, getRoleFromId } from '../discord';

// eslint-disable-next-line import/prefer-default-export
export const getCharFromStr = async (charStr: string, guild: Guild) : Promise<Character> => {
  const canonUpperBound = getRoleFromId(guild, process.env.CANON_ROLE_ID_HIGHER);
  {
    const role = getRoleFromMention(guild, charStr);
    if (role && role.comparePositionTo(canonUpperBound) < 0) {
    // We have a role. Check if there's a character assigned to it
    // And if not, create it.
      const char = await getCharacter(role.id);
      if (char) return char;
      await createCharacter(role.id);
      return getCharacter(role.id);
    }
  }
  {
    const roles = guild.roles.cache.array();
    const searchStr = charStr.toLowerCase();
    for (let i = 0; i < roles.length; i += 1) {
      const role = roles[i];
      if (!canonUpperBound || role.comparePositionTo(canonUpperBound) < 0) {
        if (role.name.toLowerCase().indexOf(searchStr) !== -1) {
          return getCharFromStr(role.id, guild);
        }
      }
    }
    return null;
  }
};

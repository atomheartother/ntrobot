import { Guild, Role } from 'discord.js';
import { Character } from '../db/characters';
import { getCharacter, createCharacter } from '../db';
import { getRoleFromMention, getRoleFromId } from '../discord';

// Grants a score to a role based on a search string
// -1 means no match, 0 is best, higher is worse.
const computeRoleScore = (role : Role, searchStr : string) => {
  const roleName = role.name.toLowerCase();
  const idx = roleName.indexOf(searchStr);
  if (idx === -1) return -1;
  const words = roleName.split(' ');
  for (let i = 0; i < words.length; i += 1) {
    if (words[i] === searchStr) {
      // One of the words in the name is an exact match.
      // If it's the first word return 0, the best possible score.
      return i;
    }
  }
  // If there were no exact matches, return a score higher than any possible exact match
  // Earlier match is better
  return words.length + idx;
};

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
    let bestRoleId : string = null;
    let bestScore : number = null;
    for (let i = 0; i < roles.length; i += 1) {
      const role = roles[i];
      if (!canonUpperBound || role.comparePositionTo(canonUpperBound) < 0) {
        const score = computeRoleScore(role, searchStr);
        if (score >= 0 && (bestScore === null || score < bestScore)) {
          bestRoleId = role.id;
          bestScore = score;
        }
      }
    }
    return bestRoleId ? getCharFromStr(bestRoleId, guild) : null;
  }
};

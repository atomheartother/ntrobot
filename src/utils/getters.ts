import {
  Guild, MessageEmbed, Role, TextChannel, User,
} from 'discord.js';
import { Character, getCharacterFromId } from '../db/characters';
import { getCharacter, createCharacter } from '../db';
import { getRoleFromMention, getRoleFromId } from '../discord';
import { characterEmbed } from '../command/check';
import { ts } from '../send';

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

const pickCharacterEmbed = async (
  channel: TextChannel,
  ids: string[],
  author: User | null = null,
  emojiList: [string, string, string] = ['⏪', '⏩', '\u2705'],
  time = 120000,
): Promise<Character | null> => {
  let page = 0;

  const formatFunc = async (id: string) : Promise<MessageEmbed | null> => {
    const c = await getCharacterFromId(id);
    const role = getRoleFromId(channel.guild, id);
    const eb = characterEmbed(c, role);
    return eb;
  };
  const sentEmbed = await channel.send({ embed: (await formatFunc(ids[page])).setFooter(`Page ${page + 1} / ${ids.length}`) });
  return new Promise((resolve) => {
    emojiList.forEach((emoji) => {
      sentEmbed.react(emoji);
    });
    const reactionCollector = sentEmbed.createReactionCollector(
      (reaction, user) => emojiList.includes(reaction.emoji.name) && !user.bot,
      { time },
    );

    const end = () => {
      if (!sentEmbed.deleted) {
        if (sentEmbed.deletable) {
          sentEmbed.delete();
        } else {
          sentEmbed.reactions.removeAll();
        }
      }
    };

    const editEmbed = async (newPage: number): Promise<void> => {
      if (newPage === page) return;
      try {
        const newEmbed = await formatFunc(ids[newPage]);
        sentEmbed.edit({ embed: newEmbed.setFooter(`Page ${newPage + 1} / ${ids.length}`) });
        page = newPage;
      } catch (e) {
        console.error('paginatedEmbed: Failed editing embed:', e);
      }
    };

    reactionCollector.on('collect', async (reaction, user) => {
      reaction.users.remove(user);
      if (author && author.id !== user.id) { return; }
      switch (reaction.emoji.name) {
        case emojiList[0]:
          editEmbed(page > 0 ? page - 1 : ids.length - 1);
          break;
        case emojiList[1]:
          editEmbed(page + 1 < ids.length ? page + 1 : 0);
          break;
        case emojiList[2]: {
          end();
          // eslint-disable-next-line no-use-before-define
          const char = await getCharFromStr(ids[page], channel);
          resolve(char);
          break;
        }
        default:
          break;
      }
    });
    reactionCollector.on('end', () => {
      end();
      resolve(null);
    });
  });
};

// eslint-disable-next-line import/prefer-default-export
export const getCharFromStr = async (
  charStr: string,
  channel: TextChannel,
  author: User = null,
) : Promise<Character> => {
  const canonUpperBound = getRoleFromId(channel.guild, process.env.CANON_ROLE_ID_HIGHER);
  {
    const role = getRoleFromMention(channel.guild, charStr);
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
    const roles = channel.guild.roles.cache.array();
    const searchStr = charStr.toLowerCase();
    const matches : [string, number][] = [];
    for (let i = 0; i < roles.length; i += 1) {
      const role = roles[i];
      if (!canonUpperBound || role.comparePositionTo(canonUpperBound) < 0) {
        const score = computeRoleScore(role, searchStr);
        if (score > -1) {
          matches.push([role.id, score]);
        }
      }
    }
    if (matches.length === 0) return null;
    if (matches.length === 1) return getCharFromStr(matches[0][0], channel);
    // Ask the user which character they meant
    await ts(channel, 'pickCharacter', { charStr });
    return pickCharacterEmbed(channel, matches
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => id),
    author);
  }
};

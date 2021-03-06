import { init } from './common';
import {
  assign, unassign, AssignReturn, getCharsFromMemberId, getMembersFromCharId,
} from './assigned';
import { rmMember } from './members';
import {
  getCharacterFromId, setCharacter, createCharacter as SQLcreateCharacter, getCharacters,
} from './characters';
import {
  getGuildInfo as SQLgetGuildInfo,
  setGuildInfo as SQLsetGuildInfo,
} from './guilds';
// Common
export const initDatabase = init;

// Assigned
export const assignChar = (
  roleId: string,
  memberId: string,
  shared = false,
) : Promise<AssignReturn> => assign(
  roleId,
  memberId,
  shared,
);

export const unassignChar = unassign;

export const memberAssignments = getCharsFromMemberId;

export const roleAssignments = getMembersFromCharId;

// Members
export const deleteMember = rmMember;

// Characters
export const createCharacter = SQLcreateCharacter;
export const getCharacter = getCharacterFromId;
export const editCharacter = setCharacter;
export const getAllCharacters = getCharacters;

// Guilds
export const getGuildInfo = SQLgetGuildInfo;
export const setGuildInfo = (
  id: string,
  lang: string | null,
  prefix: string | null,
  announce: string | null,
) : Promise<number> => SQLsetGuildInfo(id, lang, prefix, announce);

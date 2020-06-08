import { init } from './common';
import {
  assign, unassign, AssignReturn, getCharsFromMemberId, getMembersFromCharId,
} from './assigned';
import { rmMember } from './members';
import { getCharacterFromId, setCharacter } from './characters';

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
export const getCharacter = getCharacterFromId;
export const editCharacter = setCharacter;

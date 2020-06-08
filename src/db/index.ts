import {
  assign, unassign, AssignReturn, AssignedColumns, getCharsFromMemberId, getMembersFromCharId,
} from './assigned';
import { rmMember } from './members';
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

export const unassignChar = (
  roleId: string,
  memberId: string,
) : Promise<number> => unassign(roleId, memberId);

export const memberAssignments = (
  memberId: string,
) : Promise<AssignedColumns[]> => getCharsFromMemberId(memberId);

export const roleAssignments = (
  roleId: string,
) : Promise<AssignedColumns[]> => getMembersFromCharId(roleId);

// Members
export const deleteMember = (
  memberid : string,
) : Promise<number> => rmMember(memberid);

import { assign, unassign, AssignReturn } from './assigned';

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

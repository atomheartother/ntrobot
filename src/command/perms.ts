import { GuildMember } from 'discord.js';
import { roleAssignments } from '../db';
import { getCharFromStr } from '../utils/getters';

export type Permission = 'isAdmin' | 'isServerMod' | 'manageRoles' | 'characterOwner';

type PermissionEntry = (author: GuildMember, args: string[]) => Promise<boolean>;

const isAdmin = async (author: GuildMember) : Promise<boolean> => (
  author.hasPermission('ADMINISTRATOR') || author.id === process.env.OWNER_ID
);

const isServerMod = async (author: GuildMember) : Promise<boolean> => (
  isAdmin(author)
    || author.hasPermission('MANAGE_CHANNELS')
);

const manageRoles = async (
  author: GuildMember,
) : Promise<boolean> => isServerMod(author) || !!author.hasPermission('MANAGE_ROLES');

const characterOwner = async (
  author: GuildMember,
  args: string[],
) : Promise<boolean> => {
  if (manageRoles(author)) return true;
  const char = await getCharFromStr(args[0], author.guild);
  if (!char) return false;
  const owners = await roleAssignments(char.roleid);
  return owners.findIndex(({ memberid, shared }) => !shared && memberid === author.id) !== -1;
};

const permisssionList : {
    [key in Permission]: PermissionEntry
} = {
  isAdmin,
  isServerMod,
  manageRoles,
  characterOwner,
};

export default permisssionList;

import { TextChannel, GuildMember } from 'discord.js';

export type Permission = 'isAdmin' | 'isServerMod' | 'manageRoles';

type PermissionEntry = (author: GuildMember, channel: TextChannel) => boolean;

const isAdmin = (author: GuildMember) : boolean => (
  author.hasPermission('ADMINISTRATOR') || author.id === process.env.OWNER_ID
);

const isServerMod = (author: GuildMember) : boolean => (
  isAdmin(author)
    || author.hasPermission('MANAGE_CHANNELS')
);

const manageRoles = (
  author: GuildMember,
) : boolean => isServerMod(author) || !!author.hasPermission('MANAGE_ROLES');

const permisssionList : {
    [key in Permission]: PermissionEntry
} = {
  isAdmin,
  isServerMod,
  manageRoles,
};

export default permisssionList;

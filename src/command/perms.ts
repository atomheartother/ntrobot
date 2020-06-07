import { TextChannel, GuildMember } from 'discord.js';

export type Permission = 'isAdmin' | 'isServerMod' | 'isChannelMod';

type PermissionEntry = (author: GuildMember, channel: TextChannel) => boolean;

const isAdmin = (author: GuildMember) : boolean => (
  author.hasPermission('ADMINISTRATOR') || author.id === process.env.OWNER_ID
);

const isServerMod = (author: GuildMember) : boolean => (
  isAdmin(author)
    || author.hasPermission('MANAGE_CHANNELS')
    || !!author.roles.cache.get(process.env.MOD_ROLE_ID)
);

const isChannelMod = (
  author: GuildMember,
  channel : TextChannel,
) : boolean => isServerMod(author) || !!channel.permissionsFor(author).has('MANAGE_CHANNELS');

const permisssionList : {
    [key in Permission]: PermissionEntry
} = {
  isAdmin,
  isServerMod,
  isChannelMod,
};

export default permisssionList;

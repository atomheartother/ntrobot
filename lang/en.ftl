# Variables
-user =  <user ID/mention>
-char =  <role ID/mention>

# Help messages
## General
### This is displayed when the bot is pinged
prefixUsage =
    {-b}Hi! I'm {-bot-name}!{-b}
    My prefix on this server is `{$prefix}`.
    If you don't know how to use me, start with: `{$prefix}help`.

### This is in the help message header
helpHeader = {-bot-name} - the roleplay server manager

### The main help message body, followed by usage
helpIntro =
    {-b}Hey, I'm {-bot-name}{-b}, I'm a bot that specializes in roleplay server management.
    Here's a few things you can do:

## Usage strings
usage-chars = 
    {-b}Usage:{-b} `chars {-user}`
    List a member's characters.

usage-assign =
    {-b}Usage:{-b} `assign {-char} {-user}`
    Assign a character to a member.

usage-unassign =
    {-b}Usage:{-b} `unassign {-char} {-user}`
    Unassign a character from a member.

# Errors
## Resolution errors
noSuchRole =
    {-b}I couldn't find a role from `{$role}`.{-b}
    Make sure you mention it or copy its ID!

noSuchMember =
    {-b}I couldn't find a member from `{$member}`.{-b}
    Make sure you mention them or copy their ID!

## Permission fails
isAdminPermFail =
    {-b}You're not an admin!{-b}
    You have to be an admin to run `{$command}`!

isServerModPermFail =
    {-b}You're not a moderator!{-b}
    You have to be a mod to run `{$command}`!

manageRolesPermFail =
    {-b}You can't manage user roles!{-b}
    You have to have powers to manage roles to run `{$command}`!

# Commands
## Assign
assignSuccess =
    {-b}{$member} was assigned <@&{$role}>!{-b}
    They can now post as {$roleName} :)

assignSharedSuccess =
    {-b}<@&${$role}> is now being shared with {$member}!{-b}
    They can now post as {$roleName}

## Unassign
roleNotAssigned = 
    {-b}{$member} already doesn't have <@&{$role}>!{-b}
    I didn't do anything :(

unassignSuccess =
    {-b}{$member} doesn't have <@&{$role}> anymore!{-b}
    They've lost all rights on {$roleName} :)

## Chars
memberHasNoChars =
    {-b}{$name} doesn't have any characters assigned!{-b}
    A staff member can assign roles to them with the `assign` command.

sharedCharacter =
    As a shared character.

mainCharacter =
    Main owner of this character.
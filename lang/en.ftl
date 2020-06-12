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
    {-b}Usage:{-b} `assign {-char} {-user} [--shared]`
    Assign a character to a member.

usage-unassign =
    {-b}Usage:{-b} `unassign {-char} {-user}`
    Unassign a character from a member.

usage-check =
    {-b}Usage:{-b} `check {-char}`
    List who, if anyone, owns a character at the moment.

usage-edit =
    {-b}Usage:{-b} `edit {-char} [--name="Character Name"] [--describe A long description]`
    Edit a character you own. Attach a picture to change the character's avatar.

usage-show = 
    {-b}Usage:{-b} `show {-char}`
    Show this character's profile.

# Errors
## Resolution errors
noSuchChar =
    {-b}I couldn't find a character from `{$name}`.{-b}
    Maybe I've never heard of them? :o

noSuchMember =
    {-b}I couldn't find a member from `{$member}`.{-b}
    Either they're not in this server or this is the wrong name/id!

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

characterOwner =
    {-b}You don't own this character !{-b}
    You have to own this character in order to run `{$command}`.
    It's also possible I don't know this character.

# Commands
## Assign
assignSuccess =
    {-b}{$member} was assigned <@&{$role}>!{-b}
    Approved!~ <3

assignSharedSuccess =
    {-b}<@&{$role}> is now being shared with {$member}!{-b}
    Be responsible, {$member}!

## Unassign
roleNotAssigned = 
    {-b}{$member} already doesn't have <@&{$role}>!{-b}
    I didn't do anything :(

unassignSuccess =
    {-b}{$member} doesn't have <@&{$role}> anymore!{-b}
    Goodbye!

## Chars
memberHasNoChars =
    {-b}{$name} doesn't have any characters assigned!{-b}
    A staff member can assign roles to them with the `assign` command.

sharedCharacter =
    As a shared character.

mainCharacter =
    Main owner of this character.

## Check
unownedChar =
    {-b}<@&{$role}> is currently unclaimed!{-b}
    Maybe you should claim them~ :)

## Edit
cannotEdit =
    {-b}You can't edit {$name}!{-b}
    Only {$name}'s owners and server staff can edit a character.
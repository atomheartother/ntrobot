CREATE TABLE guilds (
    "guildid"     BIGINT PRIMARY KEY,
    "prefix"      text DEFAULT NULL,
    "lang"        text DEFAULT NULL
);

CREATE TABLE characters (
    "roleid"    BIGINT PRIMARY KEY,
    "name"      text DEFAULT NULL,
    "description" text DEFAULT NULL,
    "avatar"    text DEFAULT NULL,
    "canon"     boolean DEFAULT FALSE
);

CREATE TABLE members (
    "memberid"  BIGINT PRIMARY KEY,
    "lastpost"  timestamp DEFAULT NULL
);

CREATE TABLE assigned (
    "roleid" BIGINT REFERENCES characters ON DELETE CASCADE,
    "memberid" BIGINT REFERENCES members ON DELETE CASCADE,
    "shared" boolean DEFAULT FALSE,
    "prefix" text DEFAULT NULL,
    "postcount" INTEGER DEFAULT NULL,
    "assignedat" timestamp DEFAULT NULL,
    "lastpost" timestamp DEFAULT NULL,
    CONSTRAINT assignedkey PRIMARY KEY("roleid", "memberid")
);
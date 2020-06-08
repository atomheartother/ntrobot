import { pool } from './common';

export const createGuild = async (guildid: string) : Promise<number> => {
  const { rowCount } = await pool().query(
    'INSERT INTO guilds(guildid) VALUES($1) ON CONFLICT DO NOTHING',
    [guildid],
  );
  return rowCount;
};

export const rmGuild = async (guildid : string) : Promise<number> => {
  const { rowCount } = await pool().query(
    'DELETE FROM guilds WHERE guildid = $1',
    [guildid],
  );
  return rowCount;
};

export const setLang = async (guildid : string, lang : string) : Promise<number> => {
  const { rows: [{ case: inserted }] } = await pool().query(
    `INSERT INTO guilds(guildid, lang)
    VALUES($1, $2)
    ON CONFLICT(guildid) DO
      UPDATE SET lang=$2
    RETURNING case when xmax::text::int > 0 then 0 else 1 end`,
    [guildid, lang],
  );
  return inserted;
};

export const getLang = async (guildid : string) : Promise<string> => {
  const { rows: [lang] } = await pool().query(
    'SELECT lang FROM guilds WHERE guildid=$1', [guildid],
  );
  return lang;
};

export const setPrefix = async (guildid : string, prefix : string) : Promise<number> => {
  const { rows: [{ case: inserted }] } = await pool().query(
    `INSERT INTO guilds(guildid, prefix)
    VALUES($1, $2)
    ON CONFLICT(guildid) DO
      UPDATE SET prefix=$2
    RETURNING case when xmax::text::int > 0 then 0 else 1 end`,
    [guildid, prefix],
  );
  return inserted;
};

export const getGuildInfo = async (guildid : string) : Promise<{lang: string, prefix: string}> => {
  const { rows: [data] } = await pool().query(
    'SELECT lang, prefix FROM guilds WHERE guildid=$1 LIMIT 1',
    [guildid],
  );
  return data;
};

import { pool, SQLClient, getInt } from './common';

export type Character = {
  roleid: string;
  name: string;
  description: string;
  avatar: string;
  canon: boolean;
}

export const createCharacterQuery = async (
  client: SQLClient,
  roleid: string,
) : Promise<number> => {
  const { rowCount } = await client.query(
    `INSERT INTO characters(roleid) 
    VALUES($1)
    ON CONFLICT
      DO NOTHING`,
    [roleid],
  );
  return rowCount;
};

export const createCharacter = (
  roleid: string,
) : Promise<number> => createCharacterQuery(pool(), roleid);

export const rmCharacter = async (roleid : string) : Promise<{characters: number}> => {
  let characters = 0;
  ({ rowCount: characters } = await pool().query(
    'DELETE FROM characters WHERE roleid = $1',
    [roleid],
  ));
  return { characters };
};

export const getCharacterFromId = async (
  roleid: string,
) : Promise<Character | null> => {
  const { rows: [char] } = await pool().query<Character>(
    `SELECT
      ${getInt('roleid')}, name, description, avatar, canon
    FROM
      characters
    WHERE
      roleid = $1
    LIMIT 1`,
    [roleid],
  );
  return char;
};

export const setCharacter = async (
  char: Character,
) : Promise<number> => {
  const { rowCount } = await pool().query(
    `INSERT INTO characters(
      roleid, name, description, avatar
    )
    VALUES ($1, $2, $3, $4)
    ON CONFLICT(roleid) DO
      UPDATE SET name=$2, description=$3, avatar=$4`,
    [char.roleid, char.name, char.description, char.avatar],
  );
  return rowCount;
};

export const getCharacters = async () : Promise<Character[]> => {
  const { rows } = await pool().query<Character>(`
  SELECT
    ${getInt('roleid')}, name, description, avatar, canon
  FROM characters;
  `);
  return rows;
};

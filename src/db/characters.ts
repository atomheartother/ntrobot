import { pool, SQLClient } from './common';

export const createCharacterQuery = async (
  client: SQLClient,
  roleid: string,
) : Promise<number> => {
  const { rows: [{ case: inserted }] } = await client.query(
    `INSERT INTO characters(roleid) 
    VALUES($1)
    ON CONFLICT
      DO NOTHING
    RETURNING case when xmax::text::int > 0 then 0 else 1 end`,
    [roleid],
  );
  return inserted;
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

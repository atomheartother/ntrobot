import { pool, SQLClient } from './common';

export const createMemberQuery = async (
  client: SQLClient,
  memberid: string,
) : Promise<number> => {
  const { rows: [{ case: inserted }] } = await client.query(
    `INSERT INTO members(memberid) 
    VALUES($1)
    ON CONFLICT
      DO NOTHING
    RETURNING case when xmax::text::int > 0 then 0 else 1 end`,
    [memberid],
  );
  return inserted;
};

export const createCharacter = (
  memberid: string,
) : Promise<number> => createMemberQuery(pool(), memberid);

export const rmCharacter = async (roleid : string) : Promise<{characters: number}> => {
  let characters = 0;
  ({ rowCount: characters } = await pool().query(
    'DELETE FROM characters WHERE roleid = $1',
    [roleid],
  ));
  return { characters };
};

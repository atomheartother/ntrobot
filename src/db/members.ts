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

export const createMember = (
  memberid: string,
) : Promise<number> => createMemberQuery(pool(), memberid);

export const rmMember = async (memberid : string) : Promise<number> => {
  const { rowCount: members } = await pool().query(
    'DELETE FROM members WHERE memberid = $1',
    [memberid],
  );
  return members;
};

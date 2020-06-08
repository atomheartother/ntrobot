import { pool } from './common';
import { createCharacterQuery } from './characters';
import { createMemberQuery } from './members';

export type AssignReturn = {
  assigned: number,
  characters: number,
  members: number
};

export const assign = async (
  roleid: string,
  memberid: string,
  shared: boolean,
) : Promise<AssignReturn> => {
  const client = await pool().connect();
  let characters = 0;
  let members = 0;
  let assigned = 0;
  try {
    await client.query('BEGIN');
    characters = await createCharacterQuery(client, roleid);
    members = await createMemberQuery(client, memberid);
    ({ rows: [{ case: assigned }] } = await client.query(
      `INSERT INTO
      assigned(roleid, memberid, shared)
        VALUES($1, $2, $3)
      ON CONFLICT ON CONSTRAINT(assignedkey) DO
        UPDATE SET shared=$3
      RETURNING case when xmax::text::int > 0 then 0 else 1 end`,
      [roleid, memberid, shared],
    ));
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
  } finally {
    client.release();
  }
  return { assigned, members, characters };
};

export const unassign = async (
  roleid : string,
  memberid : string,
) : Promise<number> => {
  const { rowCount } = await pool().query(
    'DELETE FROM assigned WHERE roleid = $1 AND memberid = $2',
    [roleid, memberid],
  );
  return rowCount;
};

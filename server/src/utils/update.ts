// Taken from https://stackoverflow.com/questions/21759852/easier-way-to-update-data-with-node-postgres

/**
 * tableName: `users`
 * conditions: { id: 'joe-unique-id', ... }
 * data: { username: 'Joe', age: 28, status: 'active', ... }
 *
 *  "UPDATE users SET field_1 = $1, field_2 = $2, field_3 = $3, ... ( WHERE ...) RETURNING *";
 */

const isObject = (x: Object) => x !== null && typeof x === "object";
const isObjEmpty = (obj: Object) =>
  isObject(obj) && Object.keys(obj).length === 0;

interface Params {
  tableName: string;
  conditions: Record<string, string>;
  data: Record<string, string>;
}

export const update = ({ tableName, conditions = {}, data = {} }: Params) => {
  const dKeys = Object.keys(data);
  const dataTuples = dKeys.map((k, index) => {
    if (k === "primary") return `"${k}" = $${index + 1}`;
    return `${k} = $${index + 1}`;
  });
  const updates = dataTuples.join(", ");
  const len = Object.keys(data).length;

  let query = `UPDATE ${tableName} SET ${updates} `;

  if (!isObjEmpty(conditions)) {
    const keys = Object.keys(conditions);
    const condTuples = keys.map((k, index) => `${k} = $${index + 1 + len} `);
    const condPlaceholders = condTuples.join(" AND ");

    query += ` WHERE ${condPlaceholders} RETURNING *`;
  }

  const params: string[] = [];
  Object.keys(data).forEach((key) => {
    params.push(data[key]);
  });
  Object.keys(conditions).forEach((key) => {
    params.push(conditions[key]);
  });

  return { query, params };
};

import { db } from "config/db";

interface Response {
  status: string;
  message: string;
  set: any;
  error?: any;
}

export const deleteSetMutation = async (
  res: any,
  id: string
): Promise<Response> => {
  const query = `DELETE FROM sets WHERE set_id = $1 RETURNING *;`;
  const params = [id];

  try {
    const data = await db.query(query, params);

    if (!data.rowCount) {
      return res.json({
        status: "error",
        message: "Set does not exist",
        set: null,
      });
    }

    return res.json({
      status: "success",
      message: "Set deleted successfully",
      set: data.rows[0],
    });
  } catch (error) {
    console.log({ error });
    return res.json({
      status: "error",
      message: "Database error",
      set: null,
    });
  }
};

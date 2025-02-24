import { pool } from './db';
interface DbQuery
{
    text: string,
    values: Array<string>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getData(text: string, params?: any[]) {
    const client = await pool.connect();
    try {
        const res = await client.query(text, params);
        return res.rows;
    } finally {
        client.release();
    }
}

export async function insertData(query: DbQuery) {
    const client = await pool.connect();
    try {
        const res = await client.query(query);
        return res.rowCount;
    } finally {
        client.release();
    }
}
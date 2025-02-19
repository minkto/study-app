import { pool } from './db';

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
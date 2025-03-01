import { pool } from './db';
interface DbQuery {
    text: string,
    values: Array<string | number | undefined>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function queryData(text: string, params?: any[]) {
    const client = await pool.connect();
    try {
        const res = await client.query(text, params);
        return res.rows;
    } finally {
        client.release();
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function queryDataSingleRow(text: string, params?: any[]) {
    const client = await pool.connect();
    try {
        const res = await client.query(text, params);
        return res.rows[0];
    } finally {
        client.release();
    }
}

export async function queryDataRowCount(query: DbQuery) {
    const client = await pool.connect();
    try {
        const res = await client.query(query);
        return res.rowCount;
    } finally {
        client.release();
    }
}
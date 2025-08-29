import { pool } from './db';
export interface DbQuery {
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
export async function queryWithTranscation(dbQueryCollection: DbQuery[]) :Promise<boolean>
{
    const client = await pool.connect();

    try
    {
        await client.query('BEGIN');
        for(const dbQuery of dbQueryCollection) 
        {
            await client.query(dbQuery.text,dbQuery.values);
        }
        await client.query('COMMIT');
        return true;
    }
    catch(error)
    {
        console.log('An error has occured with a SQL transaction : ', error);
        
        try {
            await client.query('ROLLBACK');
        } catch (rollbackError) {
            console.error('Rollback failed:', rollbackError);
        }

        throw error;
    }
    finally
    {
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
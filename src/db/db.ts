import { Pool } from 'pg';


export const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
  max: 10,
  idleTimeoutMillis: 10_000,
});

pool.on('error', (err) => console.error('Unexpected pool error', err));

setInterval(() => {
  console.log('pool stats', {
    total: pool.totalCount,
    idle: pool.idleCount,
    waiting: pool.waitingCount,
  });
}, 5000);

export default pool
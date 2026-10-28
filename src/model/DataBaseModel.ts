import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

export class DatabaseModel {
  private _pool: pg.Pool;

  constructor() {
    const localUser = process.env.DB_USER ?? 'postgres';
    const localHost = process.env.DB_HOST ?? 'localhost';
    const localDatabase = process.env.DB_NAME ?? 'postgres';
    const localPassword = process.env.DB_PASSWORD ?? 'admin';
    const localPort = Number(process.env.DB_PORT) || 5432;

    if (!process.env.DATABASE_URL) {
      this._pool = new pg.Pool({
        user: localUser,
        host: localHost,
        database: localDatabase,
        password: localPassword,
        port: localPort,
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
        max: 10,
        idleTimeoutMillis: 10_000,
      });
      return;
    }

    try {
      const u = new URL(process.env.DATABASE_URL);
      const user = decodeURIComponent(u.username || localUser);
      const password = decodeURIComponent(u.password || localPassword);
      const host = u.hostname || localHost;
      const port = Number(u.port || localPort);
      const database = u.pathname.replace(/^\//, "") || localDatabase;

      console.log("[DB] Host:", host, "Port:", port, "Pooler?", host.includes("pooler.supabase.com"));

      this._pool = new pg.Pool({
        host,
        port,
        database,
        user,
        password,
        ssl: { rejectUnauthorized: false },
        max: 10,
        idleTimeoutMillis: 10_000,
      });
    } catch (error) {
      console.log('DATABASE_URL inválida; usando valores locais seguros para evitar queda do servidor.', error);
      this._pool = new pg.Pool({
        user: localUser,
        host: localHost,
        database: localDatabase,
        password: localPassword,
        port: localPort,
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
        max: 10,
        idleTimeoutMillis: 10_000,
      });
    }
  }

  public async testeConexao(): Promise<boolean> {
    try {
      const { rows } = await this._pool.query("select now()");
      console.clear();
      console.log("Database connected!", rows[0].now);
      return true;
    } catch (error) {
      console.error("Error to connect database X(", error);
      console.error("Não foi possível conectar ao banco de dados");
      return false;
    }
  }

  public get pool() {
    return this._pool;
  }
}

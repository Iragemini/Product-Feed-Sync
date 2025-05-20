import { Pool } from 'pg';

class PostgresClient {
  constructor(config) {
    this.pool = new Pool(config);
  }

  async query(text, params = []) {
    return this.pool.query(text, params);
  }

  async close() {
    await this.pool.end();
  }
}

export default PostgresClient;

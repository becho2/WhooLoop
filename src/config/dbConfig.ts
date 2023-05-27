import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
  mysql: {
    poolOptions: {
      client: 'mysql2',
      connection: {
        host: process.env.DATABASE_HOST,
        port: 3306,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        waitForConnections: true,
        connectionLimit: 50,
        queueLimit: 0,
        dateStrings: true,
        namedPlaceholders: true,
      },
      pool: {
        min: 0,
        max: process.env.NODE_ENV !== 'production' ? 1 : 10,
      },
      debug: process.env.NODE_ENV == 'development',
    },
  },
  oracle: {
    poolOptions: {
      client: 'oracledb',
      connection: {
        host: process.env.ORACLE_HOST,
        port: process.env.ORACLE_PORT,
        user: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        database: process.env.ORACLE_NAME,
      },
      fetchAsString: ['date', 'clob'],
      debug: process.env.NODE_ENV == 'development',
    },
  },
}));

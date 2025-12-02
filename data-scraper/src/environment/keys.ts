import dotenv from 'dotenv';
dotenv.config();

export const keys: any  = {
    port: process.env.PORT,
    mdbUser: process.env.MDBUSER,
    mdbPassword: process.env.MDBPASSWORD,
    mdbURI: process.env.MDBURI,
    mdbDataBaseName: process.env.MDBDATABASENAME,
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT
};
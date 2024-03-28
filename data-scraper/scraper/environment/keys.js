import { createRequire } from "module";
const require = createRequire(import.meta.url);
const dotenv = require('dotenv');
dotenv.config();

export const keys  = {
    port: process.env.PORT,
    mdbUser: process.env.MDBUSER,
    mdbPassword: process.env.MDBPASSWORD,
    mdbURI: process.env.MDBURI,
    mdbDataBaseName: process.env.MDBDATABASENAME
};
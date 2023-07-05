import {createPool} from 'mysql2/promise'

//**Railway Mysql Connection Credentials**
/*
export const pool = createPool({
    host:'containers-us-west-133.railway.app',
    user:'root',
    password:'Xt4iiHY0BNk9qAq3rosm',
    port:6328,
    database:'railway'
})
*/
import {
    DB_DATABASE,
    DB_HOST,
    DB_PASSWORD,
    DB_PORT,
    DB_USER,
  } from "./config.js";
  
export const pool = createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    database: DB_DATABASE,
});


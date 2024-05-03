import { app } from "./app.js";
import dotenv from 'dotenv'
import connectDB from "./db/index.js";
dotenv.config({ path: './.env' })


connectDB()
    .then(app.listen(3001 , function () { console.log('Server running at 3001'); }))
    .catch(error => { console.log("Mongo not connected!", error); })
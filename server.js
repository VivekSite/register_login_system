import express from "express";
import dotenv from "dotenv";
import colors from 'colors';
import morgan from "morgan";
import cors from 'cors';
import mongoDB from './config/db.js';
import authRoutes from "./routes/authRoutes.js";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//––––––––––––––––––––––– dotenv config ––––––––––––––––––
dotenv.config();

//––––––––––––––––––––––– Rest obj –––––––––––––––––––––––
const server = express();

//––––––––––––––––––––––– Middleware –––––––––––––––––––––
server.use(cors());
server.use(express.json())
server.use(morgan('dev'))
server.use(express.static(path.join(__dirname, "./client/build")));

//––––––––––––––––––––––– Auth Routes –––––––––––––––––––––
server.use('/api/v1/auth', authRoutes)

//––––––––––––––––––––––– Rest api ––––––––––––––––––––––

server.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
})






//––––––––––––––––––––––– Server Listening –––––––––––––––––
const PORT = process.env.PORT || 8080;


//––––––––––––––––––––––– Connect to database ––––––––––––
mongoDB().then(()=>{
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`.bgGreen.white);
  })
})

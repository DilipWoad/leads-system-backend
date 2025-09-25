import dotenv from "dotenv";
dotenv.config({
  path: ".env",
});
import { app } from "./app.js";
import Prisma from "@prisma/client";
// console.log("It will come first here");

const {PrismaClient,Status} = Prisma;

export const prisma = new PrismaClient()
export const statusEnum = Status;

const port = process.env.PORT || 8080;

//connectDB here
//if success connection
//start server
app.listen(port, () => {
  console.log(`⚙ Server Running at port : ${port} `);
});

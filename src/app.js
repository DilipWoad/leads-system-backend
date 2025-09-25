//here we config our express js
import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";

export const app = express();


app.use(cors({
  origin:"https://leads-system-lyart.vercel.app",
   credentials: true,
}))
//handles json format req
app.use(express.json({ limit: "20kb" }));

app.use(cookieParser());

app.use(express.urlencoded({ limit: "20kb", extended: true }));

app.get("/", (req, res) => {
  console.log("Hello Dilip")
  return  res.send("Hello Dilip!!");
});

import authRouter from "./routes/auth.route.js";
import leadRouter from "./routes/lead.route.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/leads", leadRouter);

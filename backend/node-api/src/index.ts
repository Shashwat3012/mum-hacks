import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_: any, res: any) =>
  res.send("Miss.Information backend running"),
);

app.listen(8000, () => console.log("Backend running on http://localhost:8000"));

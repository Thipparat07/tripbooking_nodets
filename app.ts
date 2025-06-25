import express from "express";
import { router as index } from "./controller/index";
import { router as trip } from "./controller/trip";
import bodyParser from "body-parser";

export const app = express();

app.use(bodyParser.text());
app.use(bodyParser.json());
app.use("/", index);
app.use("/trip",trip);
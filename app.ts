import express from "express";
import { router as index } from "./controller/index";
import { router as trip } from "./controller/trip";
import { router as upload } from "./controller/upload";
import bodyParser from "body-parser";

export const app = express();

app.use(bodyParser.text());
app.use(bodyParser.json());
app.use("/", index);
app.use("/trip",trip);
app.use("/upload", upload);
app.use("/uploads", express.static("uploads"));
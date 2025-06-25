import express from "express";
import { conn } from "../db/connectiondb";
import mysql from "mysql";


export interface Trip {
    idx:           number;
    name:          string;
    country:       string;
    destinationid: number;
    coverimage:    string;
    detail:        string;
    price:         number;
    duration:      number;
} 

export const router = express.Router();

router.get("/", (req, res) => {
  conn.query("select * from trip", (err, result, fields) => {
    let trips = result as Trip[];
    res.json(result);
  });
});


router.get("/:id", (req, res) => {
  let id = +req.params.id;
  conn.query("select * from trip where idx = ?" , [id], (err, result, fields) => {
  if (err) throw err;
    res.json(result);
  });
});

router.get("/search/fields", (req, res) => {
  conn.query(
    "select * from trip where (idx IS NULL OR idx = ?) OR (name IS NULL OR name like ?)",
    [ req.query.id, "%" + req.query.name + "%"],
    (err, result, fields) => {
    if (err) throw err;
      res.json(result);
    }
  );
});

router.post("/newdata", (req, res) => {
  let trip: Trip = req.body;
  let sql =
    "INSERT INTO `trip`(`name`, `country`, `destinationid`, `coverimage`, `detail`, `price`, `duration`) VALUES (?,?,?,?,?,?,?)";
  sql = mysql.format(sql, [
    trip.name,
    trip.country,
    trip.destinationid,
    trip.coverimage,
    trip.detail,
    trip.price,
    trip.duration,
  ]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res
      .status(201)
      .json({ affected_row: result.affectedRows, last_idx: result.insertId });
  });
});


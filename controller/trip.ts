import express from "express";
import { conn, queryAsync } from "../db/connectiondb";
import mysql from "mysql";
import { Trip } from "../model/Trip";

export const router = express.Router();

// ===============================
// GET /trips
// ===============================
router.get("/", (req, res) => {
  try {
    if (req.query.id) {
      conn.query(
        "SELECT * FROM trip WHERE idx= ?",
        [req.query.id],
        (err, result) => {
          if (err) return res.status(500).json({ message: "DB error", error: err });
          res.json(result as Trip[]);
        }
      );
    } else {
      conn.query("SELECT * FROM trip", (err, result) => {
        if (err) return res.status(500).json({ message: "DB error", error: err });
        res.json(result as Trip[]);
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ===============================
// GET /trips/search/fields
// ===============================
router.get("/search/fields", async (req, res) => {
  try {
    const id = req.query.id ? +req.query.id : null;
    const name = req.query.name ? `%${req.query.name}%` : null;

    let sql = "SELECT * FROM trip WHERE 1=1";
    const params: any[] = [];

    if (id !== null) {
      sql += " AND idx = ?";
      params.push(id);
    }

    if (name !== null) {
      sql += " AND name LIKE ?";
      params.push(name);
    }

    const trips = (await queryAsync(mysql.format(sql, params))) as Trip[];
    res.json(trips || []);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

// ===============================
// GET /trips/:id
// ===============================
router.get("/:id", (req, res) => {
  try {
    let id = +req.params.id;
    conn.query("SELECT * FROM trip WHERE idx = ?", [id], (err, result) => {
      if (err) return res.status(500).json({ message: "DB error", error: err });
      res.json(result as Trip[]);
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ===============================
// POST /trips
// ===============================
router.post("/", (req, res) => {
  try {
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
      if (err) return res.status(500).json({ message: "DB error", error: err });
      res.status(201).json({
        affected_row: result.affectedRows,
        last_idx: result.insertId,
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ===============================
// DELETE /trips/:id
// ===============================
router.delete("/:id", (req, res) => {
  try {
    let id = +req.params.id;
    conn.query("DELETE FROM trip WHERE idx = ?", [id], (err, result) => {
      if (err) return res.status(500).json({ message: "DB error", error: err });
      res.status(200).json({ affected_row: result.affectedRows });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ===============================
// PUT /trips/:id
// ===============================
router.put("/:id", async (req, res) => {
  try {
    let id = +req.params.id;// ดึง id จาก params
    let trip: Trip = req.body;// ดึงข้อมูลใหม่จาก body

    // query trip เดิมจาก database
    let sql = mysql.format("SELECT * FROM trip WHERE idx = ?", [id]);
    let result = (await queryAsync(sql)) as Trip[];

    if (result.length > 0) {
      let tripOriginal = result[0];// ข้อมูล trip เดิม
      let updateTrip = { ...tripOriginal, ...trip }; // merge ข้อมูลเดิมกับข้อมูลใหม่

      // สร้าง query update
      sql =
        "UPDATE `trip` SET `name`=?, `country`=?, `destinationid`=?, `coverimage`=?, `detail`=?, `price`=?, `duration`=? WHERE `idx`=?";
      sql = mysql.format(sql, [
        updateTrip.name,
        updateTrip.country,
        updateTrip.destinationid,
        updateTrip.coverimage,
        updateTrip.detail,
        updateTrip.price,
        updateTrip.duration,
        id,
      ]);
      conn.query(sql, (err, result) => {
        if (err) return res.status(500).json({ message: "DB error", error: err });
        res.status(200).json({ affected_row: result.affectedRows });
      });
    } else {
      res.status(404).json({ message: "Trip not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

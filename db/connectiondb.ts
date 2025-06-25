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

export const conn = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "tripbooking",
  password: "trip1234",
  database: "tripbooking",
});
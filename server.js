/**
 * @file server.js
 * @brief - Handles all backend logic for the wishlist application.
 * 
 * Communicates with a database to handle creating, reading,
 * updating, and deleting information from a wishlist. 
 * 
 * @author - Ryan McGuire 
 * @date 12/15/2019
 */


const express = require('express');
const mysql = require('mysql');

// setup the database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'wishlist',
});
// connect to the database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySql Connected...');
});

// create the app
const app = express();

// setup body-parser and CORS compatibility
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept');
  next();
})

/**
 * Requests a wishlist from the database.
 * @param wishlist - name of wishlist to lookup
 */
app.get('/api/getwishlist/:wishlist', (req, res) => {
  let sql = `SELECT * FROM lists WHERE name='${req.params.wishlist}'`;
  db.query(sql, (err, results) => {
    if (err) throw err;
    // will return empty if no wishlist found
    res.json(results);
  });
})

/**
 * Removes a specified entry from the database.
 * @param {int} id - id of entry to remove
 */
app.get('/api/removeitem/:id', (req, res) => {
  let sql = `DELETE FROM lists WHERE id=${req.params.id}`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
})

/**
 * Adds a specified item to the database.
 * Required data: name, title, and url.
 */
app.post('/api/additem', (req, res) => {
  let sql = `INSERT INTO lists (name, title, url) VALUES
              ('${req.body.name}', '${req.body.title}', '${req.body.url}')`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
})

/**
 * Edits a specified entry in the database.
 * Required data: title, url, name, and id (to know which entry to edit).
 */
app.post('/api/edititem', (req, res) => {
  let sql = `UPDATE lists
             SET title='${req.body.title}', url='${req.body.url}'
             WHERE name='${req.body.name}' AND id=${req.body.id}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
})

/**
 * Start the server.
 */
const port = 5000;
app.listen(port, () => `Server running on port ${port}`);
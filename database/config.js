const { Pool } = require('pg');
require('dotenv').config();

exports.pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// testing connection
// (() =>
//   client.connect((err) => {
//     if (err) {
//       console.error("connection error", err.stack);
//     } else {
//       console.log("connected");
//     }
//   }))();

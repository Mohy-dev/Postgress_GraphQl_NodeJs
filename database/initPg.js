const entity = require('./config.js').pool;

const queryUnit = {
  text: 'INSERT INTO units(ID, unitName) VALUES($1, $2) RETURNING *',
  values: ['1', 'unitTest'],
};

const queryLock = {
  text: 'INSERT INTO lock(remote_lock_id, unitid) VALUES($1, $2) RETURNING *',
  values: ['8874604198cdac02b162', '1'],
};

executeQuery(queryUnit);
executeQuery(queryLock);

async function executeQuery(query) {
  try {
    const res = await entity.query(query);
    console.log(res.rows);
  } catch (err) {
    console.log(err.stack);
  }
}

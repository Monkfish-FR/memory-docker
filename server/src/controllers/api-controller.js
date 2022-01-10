/* eslint-disable no-console */
const AppDAO = require('../database/AppDAO');

const TABLE_NAME = 'scores';

const db = new AppDAO('db.sqlite');

// Crée la table 'scores' si elle n'existe pas
db.tableExists(TABLE_NAME)
  .then((response) => {
    if (response.exist === 0) {
      db.createTable(TABLE_NAME, [
        {
          name: 'id',
          type: 'primary',
        },
        {
          name: 'score',
          type: 'INTEGER',
          notNull: true,
        },
      ]);
    }
  });

/**
 * Récupère tous les scores
 */
exports.scoresAll = async (req, res) => {
  db.all(`SELECT * FROM ${TABLE_NAME} ORDER BY score ASC`)
    .then((rows) => {
      res.send(rows);
    })
    .catch((err) => {
      console.log('Error: ');
      console.log(JSON.stringify(err));
    });
};

/**
 * Récupère les meilleurs scores
 */
exports.scoresTop = async (req, res) => {
  const limit = req.query.limit || 10;

  db.all(`SELECT * FROM ${TABLE_NAME} ORDER BY score ASC LIMIT ${limit}`)
    .then((rows) => {
      res.send(rows);
    })
    .catch((err) => {
      console.log('Error: ');
      console.log(JSON.stringify(err));
    });
};

/**
 * Insère un nouveau score en BDD
 */
exports.scoreAdd = async (req, res) => {
  const { score } = req.body;

  const sql = `
    INSERT INTO ${TABLE_NAME}(score)
    VALUES (?)
  `;

  db.run(sql, [score])
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      console.log('Error: ');
      console.log(JSON.stringify(err));
    });
};

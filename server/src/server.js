/* eslint-disable no-console */
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');

// const testRouter = require('./routes/test-routes');
const apiRouter = require('./routes/api-routes');

const SERVER_PORT = process.env.PORT || 8080;

const app = express();
// active CORS
app.use(cors());
// sécurise Express en ajoutant des __headers__
app.use(helmet());
// compresse le corps des réponses
app.use(compression());
// reconnaît les objets de requête entrants sous forme de chaînes ou de tableaux
app.use(express.urlencoded({ extended: false }));
// reconnaît les objets de requête entrants sous forme d'objet JSON
app.use(express.json());

// Met en place les routes
// app.use('/test', testRouter);
app.use('/api', apiRouter);

if (process.env.NODE_ENV === 'production') {
  // dossier distant
  app.use(express.static(path.join(__dirname, 'client/dist')));
}

app.listen(SERVER_PORT, () => {
  console.log(`App is listening at http://localhost:${SERVER_PORT}`);
});

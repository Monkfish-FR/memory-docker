import memorySettings from './js/MemorySettings';
import Memory from './js/Memory';
import Timer from './js/Timer';

import settings from './settings.json';

import './scss/main.scss';

const game = document.getElementById('game');
const scores = document.getElementById('scores');
const headerScroll = document.getElementById('headerScroll');

/* Défile jusqu'à la div #game  */
headerScroll.addEventListener('touchend', () => {
  game.scrollIntoView({ behavior: 'smooth' });
});

/* Crée le jeu */
// On crée le compte à rebours ; null si pas de décompte
// const timer = new Timer();
const timer = new Timer({ duration: settings.timer.duration });
// On crée le jeu
const memory = new Memory({
  ...memorySettings,
  wrapper: game,
  scoresWrapper: scores,
  timer,
});
memory.init();

/* Quand une victoire est détectée */
// @see Memory::emitVictory()
document.addEventListener('memory:win', (e) => {
  // On cache la modale
  memory.modal.hide();
  // On affiche les scores
  setTimeout(() => {
    memory.displayScores();
  }, 1000);
});

/* Teste le server */
// To run the test, uncomment:
//   - PROXY 'test' in `webpack.config.js`
//   - SERVER.js
// fetch('/test/request')
//   .then((res) => res.json())
//   .then((user) => {
//     console.log(`[TEST SERVER PASSED] Hello ${user.username}`);
//   })
//   .catch((err) => {
//     console.error(`[TEST SERVER FAILED] ${err}`);
//   });

import settings from '../settings.json';

import sprite from '../assets/images/cards.png';

const { game, cards, scores } = settings;
const memorySettings = {
  rows: game.rows,
  cols: game.cols,
  cards: [...cards.description],
  sprite,
  scoreToDisplay: scores.displayLimit,
};

export default memorySettings;

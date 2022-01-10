/* eslint-disable global-require */
/* @see getSpriteWidth() method */
import Button from './Button';
import Modal from './Modal';

/**
 * @class Memory
 */
export default class Memory {
  /**
   * Crée une nouvelle instance de Memory
   *
   * @param {Object} options
   * @param {Number} options.rows Le nombre de lignes
   * @param {Number} options.cols Le nombre de colonnes
   * @param {Object[]} options.cards Le descriptif des cartes
   * @param {string} options.cards.name Le nom de la carte
   * @param {Number} options.cards.index L'index de la carte (position dans le sprite)
   * @param {String} options.sprite L'URL de du sprite
   * @param {Number} options.scoreToDisplay Le nombre de scores à afficher
   * @param {HTMLElement} options.wrapper Le conteneur du jeu
   * @param {HTMLElement|null} options.timer Le compteur du jeu ; null si pas de compteur
   */
  constructor(options) {
    const {
      rows,
      cols,
      cards,
      sprite,
      wrapper,
      scoresWrapper,
      scoreToDisplay,
    } = options;

    this.wrapper = wrapper;
    this.scoresWrapper = scoresWrapper;
    this.board = null;

    this.timer = options.timer || null;
    this.timerIsLaunched = false;

    this.modal = new Modal();

    this.cards = [...cards];

    [this.rows, this.cols] = this.setGrid(rows, cols);
    this.nbPairs = (this.rows * this.cols) / 2;

    this.firstCard = null;
    this.foundPairs = 0;

    this.sprite = sprite;
    this.spriteWidth = null;
    this.spriteIsLarger = null;
    this.gapBetweenCards = 4; // in px

    this.scoreToDisplay = scoreToDisplay;
    this.score = null;

    if (this.timer) this.setTimerCallback();
  }

  /**
   * Définit la grille
   *
   * @param {Number} rows Le nombre de lignes
   * @param {Number} cols Le nombre de colonnes
   *
   * @returns {Number[]}
   */
  setGrid(rows, cols) {
    const maxSquares = this.cards.length * 2;

    const gteRowsFactors = (number) => (
      [...Array(number + 1).keys()].find((i) => (
        number % i === 0 && i >= rows
      ))
    );

    let fixRows = Math.min(rows, cols);
    let fixCols = Math.max(rows, cols);

    // Si la grille est trop grande pour le nombre de cartes disponibles,
    // on reconstruit une grille la plus proche possible
    if (maxSquares < rows * cols) {
      // on cherche le facteur de maxSquares le plus proche de rows
      // [ gte = greater than or equal ]
      fixRows = gteRowsFactors(maxSquares);
      // on calcule le nombre de colonnes
      fixCols = maxSquares / fixRows;
    } else if ((rows * cols) % 2 !== 0) {
      // On s'assure que le nombre de cases est pair
      // on calcule la grille demandée et on ajoute 1 case
      const request = (rows * cols) + 1;
      // on cherche le facteur de la grille le plus proche de rows
      const newRows = gteRowsFactors(request);
      const newCols = request / newRows;

      // on rappelle la fonction
      // pour s'assurer que la nouvelle grille à la bonne taille
      [fixRows, fixCols] = this.setGrid(newRows, newCols);
    }

    return [fixRows, fixCols];
  }

  /**
   * Crée le paquet de cartes
   */
  setDeck() {
    // On mélange les cartes disponibles
    const cardsShuffled = Memory.shuffle(this.cards);
    // On prend le nombre de cartes nécessaires
    const cardsSet = cardsShuffled.slice(0, this.nbPairs);
    // On "double" le tableau pour avoir les paires
    const cardsDeck = cardsSet.concat(cardsSet);
    // On re-mélange les cartes
    return Memory.shuffle(cardsDeck);
  }

  /**
   * Définit la fonction à appeler à la fin du timer
   */
  setTimerCallback() {
    this.timer.cb = () => {
      const ms = this.timer.pause();
      this.lost();
    };
  }

  /**
   * Initialise le jeu
   */
  init() {
    this.getSpriteWidth()
      .then((response) => {
        this.spriteWidth = response;

        this.board = this.buildBoard();
        this.wrapper.appendChild(this.board);

        if (this.timer) {
          this.addTimer();
        }

        const cardWidth = this.board.clientWidth / this.cols;
        const cardInnerWidth = cardWidth - this.gapBetweenCards * 2;
        this.spriteIsLarger = response && cardInnerWidth < response;

        this.play();
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(`[ERROR Memory.init()] ${error}`);
      });
  }

  /**
   * Détermine la largeur de l'image sprite
   *
   * @returns {Promise}
   */
  getSpriteWidth() {
    const http = require('http');
    const imagesize = require('imagesize');

    return new Promise((resolve, reject) => {
      http.get(this.sprite, (response) => {
        imagesize(response, (err, { width }) => {
          if (err) reject(err);

          resolve(width);
        });
      });
    });
  }

  /**
   * Crée le plateau
   *
   * @returns {HTMLDivElement}
   */
  buildBoard() {
    const board = document.createElement('div');
    board.id = 'board';
    board.classList.add('game__board');

    if (this.cols < 5 || this.rows > 5) board.classList.add('game__board--narrow');

    return board;
  }

  /**
   * Ajoute le timer
   */
  addTimer() {
    this.wrapper.appendChild(this.timer.timer);
  }

  /**
   * Recharge le timer
   */
  refreshTimer() {
    if (this.timerIsLaunched) {
      this.timer.refresh();
      this.timerIsLaunched = false;
    }
  }

  /**
   * Lance une partie
   */
  play() {
    this.board.textContent = '';

    if (this.timer) {
      this.refreshTimer();
    }

    this.firstCard = null;
    this.foundPairs = 0;

    const deck = this.setDeck();
    console.log(172, deck);

    const squareWidth = 100 / this.cols;

    deck.forEach(({ name, index }) => {
      const square = this.buildSquare(squareWidth, name, index);
      this.board.append(square);
    });
  }

  /**
   * Crée une case
   *
   * @param {Number} width La largeur de la case en pourcentage (sans l'unité)
   * @param {string} cardName Le numéro de la carte
   * @param {Number} index L'index de la carte
   *
   * @returns {HTMLDivElement}
   */
  buildSquare(width, cardName, index) {
    const square = document.createElement('div');
    square.classList.add('game__square');
    square.style.paddingBottom = `${width}%`;
    square.style.width = `${width}%`;

    const squareContent = document.createElement('div');
    squareContent.classList.add('game__square__content');
    squareContent.style.padding = `${this.gapBetweenCards}px`;

    const card = this.buildCard(cardName, index);

    squareContent.appendChild(card);
    square.appendChild(squareContent);

    return square;
  }

  /**
   * Crée une carte
   *
   * @param {string} cardName Le nom de la carte
   * @param {Number} index L'index de la carte
   *
   * @returns {HTMLDivElement}
   */
  buildCard(cardName, index) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.name = cardName;

    const inner = document.createElement('div');
    inner.classList.add('card__inner');

    const front = document.createElement('div');
    front.classList.add('card__inner__front');

    const back = document.createElement('div');
    back.classList.add('card__inner__back');

    const backCard = document.createElement('div');
    backCard.classList.add('card-back', `card-back--${index}`);

    const spacerImg = Memory.createSpacerImg();
    const spriteImg = this.createSpriteImg();

    backCard.append(spacerImg, spriteImg);
    back.appendChild(backCard);
    inner.append(front, back);
    card.appendChild(inner);

    card.addEventListener('click', (e) => {
      // Si la carte n'est pas déjà retournée…
      if (
        !e.target.classList.contains('card--clicked')
        && !e.target.classList.contains('card--found')
        && !this.board.classList.contains('disabled')
      ) {
        // …on la traite
        this.clickCard(e.target);
      }
    });

    return card;
  }

  /**
   * Crée un espaceur
   *
   * @returns {HTMLImageElement}
   */
  static createSpacerImg() {
    const img = document.createElement('img');
    img.classList.add('spacer');
    img.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
    img.alt = '';

    return img;
  }

  /**
   * Crée l'image avec le sprite des cartes
   *
   * @returns {HTMLImageElement}
   */
  createSpriteImg() {
    const img = document.createElement('img');
    img.classList.add('sprite');
    img.src = this.sprite;
    img.alt = '';

    if (this.spriteIsLarger) img.classList.add('sprite--wide');

    return img;
  }

  /**
   * Sélectionne la carte
   *
   * @param {HTMLDivElement} card La carte sélectionnée
   */
  clickCard(card) {
    if (this.timer && !this.timerIsLaunched) {
      this.timer.play();
      this.timerIsLaunched = true;
    }

    card.classList.add('card--clicked');

    // Si c'est la 1ère carte…
    if (!this.firstCard) {
      // …on la garde en mémoire
      this.firstCard = card;
    } else {
      // C'est la seconde carte retournée…
      // …on bloque les prochains clics
      this.board.classList.add('disabled');

      if (card.dataset.name === this.firstCard.dataset.name) {
        // …la paire est trouvée
        this.foundPairs += 1;
        // on "réactive" le jeu
        this.board.classList.remove('disabled');

        this.firstCard.classList.replace('card--clicked', 'card--found');
        card.classList.replace('card--clicked', 'card--found');
        // on regarde si c'est gagné
        this.checkVictory();
      } else {
        // …c'est loupé !
        const first = this.firstCard;

        setTimeout(() => {
          // on "réactive" le jeu
          this.board.classList.remove('disabled');

          first.classList.remove('card--clicked');
          card.classList.remove('card--clicked');
        }, 500);
      }

      this.firstCard = null;
    }
  }

  /**
   * Détermine si c'est gagné
   *
   * @param {Boolean} [force=false] Force la victoire ?
   */
  checkVictory(force = false) {
    if (force || this.foundPairs === this.nbPairs) {
      const ms = this.timer.pause();

      this.modal.success({
        title: 'You win!',
        content: `
          Bravo, ton score est de
          <strong>${Memory.getScore(ms)}</strong>&nbsp;s
        `,
        button: 'Voir les meilleurs temps',
        buttonHandle: Memory.emitVictory,
      });

      this.addScore(ms);
    }
  }

  /**
   * Crée un évènement personnaisé en cas de victoire
   */
  static emitVictory() {
    const victoryEvent = new CustomEvent('memory:win');
    document.dispatchEvent(victoryEvent);
  }

  /**
   * Affiche une modale quand c'est perdu
   */
  lost() {
    this.score = null;

    this.modal.error({
      title: 'Time over!',
      content: 'Oups, le temps est écoulé…',
      button: 'Je recommence',
      buttonHandle: null,
    });

    this.play();
  }

  /**
   * Ajoute le score en BDD
   *
   * @param {Number} score Le score (en ms)
   */
  addScore(score) {
    fetch('/api/scores/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ score }),
    })
      .then((res) => res.json())
      .then((response) => {
        this.score = {
          id: response.lastID,
          score,
        };
      })
      .catch((err) => {
        console.error(`[Error retrieving scores] ${err}`);
      });
  }

  /**
   * Affiche les scores
   */
  displayScores() {
    // fetch('/api/scores/top')
    fetch(`/api/scores/top?limit=${this.scoreToDisplay}`)
      .then((res) => res.json())
      .then((scores) => {
        const parent = this.scoresWrapper.parentNode;
        const scoresData = this.scoresWrapper.querySelector('#scoresData');

        const scoresList = scores.map(({ id, score, createdAt }, index) => {
          const itemClass = id === this.score.id
            ? 'border-success'
            : '';

          return `
            <tr class="${itemClass}">
              <td class="is-narrow">${index + 1}</td>
              <td>${Memory.getScore(score)}&nbsp;s</td>
              <td>${createdAt}</td>
            </tr>
          `;
        });

        scoresData.innerHTML = scoresList.join('');

        if (!document.getElementById('replayGame')) {
          const button = Button.button({
            id: 'replayGame',
            classNames: ['button', 'button--primary'],
            content: 'Je peux les battre',
          });
          button.onclick = () => {
            this.play();
            parent.classList.remove('main__content--flip');
          };

          this.scoresWrapper.appendChild(button);
        }

        parent.classList.add('main__content--flip');
      })
      .catch((err) => {
        console.error(`[Error retrieving scores] ${err}`);
      });
  }

  /**
   * Récupère le score
   *
   * @param {Number} ms Le temps en millisecondes
   * @returns {Number}
   */
  static getScore(ms) {
    return Number.parseFloat(ms / 1000).toFixed(1); // Format : x.y (en secondes)
  }

  /**
   * Mélange un tableau (ici les cartes)
   * Array.sort() présente des biais de randomisation,
   * on utilise ici le mélange de Fisher-Yates
   * [https://fr.wikipedia.org/wiki/M%C3%A9lange_de_Fisher-Yates]
   *
   * @param {Array} arr Le tableau à mélanger
   *
   * @returns {Array}
   */
  static shuffle(arr) {
    const shuffled = [...arr];

    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }
}

/**
 * @class Timer
 */
export default class Timer {
  /**
   * Crée une nouvelle instance de Timer
   *
   * @param {Object} [options]
   * @param {string|null} [options.id] L'ID du conteneur
   * @param {string|null} [options.duration] La durée du compte à rebours (format animation CSS)
   * @param {Function|null} [options.callback] Une fonction à exécuter à la fin du décompte
   */
  constructor(options = {}) {
    const { id, duration, callback } = options;

    this.id = id || null;
    this.duration = duration || '60s';
    this.callback = callback || null;

    this.animation = null;
    this.timer = this.buildProgressBar();

    this.start = null;
    this.end = null;
  }

  /**
   * Crée le conteneur pour le timer
   *
   * @returns {HTMLElement}
   */
  buildProgressBar() {
    const progressBar = this.id
      ? document.getElementById(this.id)
      : document.createElement('div');

    if (!this.id) {
      this.id = 'timer';
      progressBar.id = this.id;
    }

    progressBar.classList.add('timer');

    this.animation = this.buildAnimatedElement();

    progressBar.appendChild(this.animation);

    return progressBar;
  }

  /**
   * Ajoute la partie animée du timer
   *
   * @returns {HTMLDivElement}
   */
  buildAnimatedElement() {
    const progressBarInner = document.createElement('div');
    progressBarInner.classList.add('timer__inner');
    progressBarInner.style.animationDuration = this.duration;
    progressBarInner.style.animationPlayState = 'paused';

    if (this.callback) this.addEvent();

    return progressBarInner;
  }

  /**
   * Ajoute un callback à la fin de l'animation
   */
  addEvent() {
    this.animation.addEventListener('animationend', this.callback);
  }

  /**
   * Lance le compte à rebours
   */
  play() {
    this.start = new Date().getTime();

    this.animation.style.animationPlayState = 'running';
  }

  /**
   * Stoppe le compte à rebours
   */
  pause() {
    this.end = new Date().getTime();
    const diff = this.end - this.start;

    this.animation.style.animationPlayState = 'paused';

    return parseInt(diff, 10);
  }

  /**
   * Relance l'animation du Timer
   *
   * @see https://css-tricks.com/restart-css-animation/
   */
  refresh() {
    this.animation.classList.remove('timer__inner');
    void this.animation.offsetWidth;
    this.animation.classList.add('timer__inner');
  }

  /**
   * Définit le callback de fin d'animation
   *
   * @param {Function} func Le callback
   */
  set cb(func) {
    this.callback = func;
    this.addEvent();
  }
}

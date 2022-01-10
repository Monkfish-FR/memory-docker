import Button from './Button';

/**
 * @class Modal
 */
export default class Modal {
  /**
   * Crée une nouvelle instance de Modal
   */
  constructor() {
    this.modal = document.getElementById('modal') || Modal.buildModal();

    this.insert();
  }

  /**
   * Crée la modale
   *
   * @returns {HTMLDivElement}
   */
  static buildModal() {
    const modal = document.createElement('div');
    modal.id = 'modal';
    modal.classList.add('modal');

    const overlay = document.createElement('div');
    overlay.classList.add('modal__overlay');

    const content = document.createElement('div');
    content.classList.add('modal__content');

    const title = document.createElement('h2');
    title.id = 'modalTitle';

    const p = document.createElement('p');
    p.id = 'modalContent';

    const button = Modal.buildButton();

    content.append(title, p, button);
    overlay.appendChild(content);
    modal.appendChild(overlay);

    return modal;
  }

  /**
   * Crée le bouton
   *
   * @returns {HTMLButtonElement}
   */
  static buildButton() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('t-center');

    const button = Button.button({
      id: 'modalButton',
      classNames: ['button', 'button--primary'],
      content: 'Je peux les battre',
    });

    wrapper.appendChild(button);

    return wrapper;
  }

  /**
   * Insère les données de la modale
   *
   * @param {Object} data
   * @param {string} data.title Le titre de la modale
   * @param {string} data.content Le contenu de la modale
   * @param {string} data.button Le texte du bouton
   * @param {Function|null} [data.buttonHandle] La fonction ar appeler au clic sue le bouton
   */
  populate({
    title,
    content,
    button,
    buttonHandle,
  }) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalContent').innerHTML = content;
    document.getElementById('modalButton').textContent = button;

    if (buttonHandle) {
      document.getElementById('modalButton').addEventListener('click', (e) => {
        e.preventDefault();
        buttonHandle();
      }, { once: true });
    } else {
      this.addHideEvent();
    }
  }

  /**
   * Attache l'évènement de fermeture
   */
  addHideEvent() {
    this.modal.addEventListener('click', () => {
      this.hide();
    });
  }

  /**
   * Ajoute la modale dans le DOM
   */
  insert() {
    const app = document.getElementById('app');
    const parent = app.parentNode;

    parent.insertBefore(this.modal, app);
  }

  /**
   * Affiche une modale
   *
   * @param {string} type Le type de modale ('success', 'error')
   * @param {Object} data
   * @param {string} data.title Le titre de la modale
   * @param {string} data.content Le contenu de la modale
   * @param {string} data.button Le texte du bouton
   * @param {Function|null} [data.buttonHandle] La fonction ar appeler au clic sue le bouton
   */
  show(type, data) {
    this.populate(data);
    this.modal.classList.add(`modal--${type}`);
  }

  /**
   * Affiche une modale de type 'success'
   *
   * @param {Object} data
   * @param {string} data.title Le titre de la modale
   * @param {string} data.content Le contenu de la modale
   * @param {string} data.button Le texte du bouton
   * @param {Function|null} [data.buttonHandle] La fonction ar appeler au clic sue le bouton
   */
  success(data) {
    this.show('success', data);
  }

  /**
   * Affiche une modale de type 'error'
   *
   * @param {Object} data
   * @param {string} data.title Le titre de la modale
   * @param {string} data.content Le contenu de la modale
   * @param {string} data.button Le texte du bouton
   * @param {Function|null} [data.buttonHandle] La fonction ar appeler au clic sue le bouton
   */
  error(data) {
    this.show('error', data);
  }

  /**
   * Cache la modale
   */
  hide() {
    this.modal.classList.add('modal--out');

    setTimeout(() => {
      this.modal.className = 'modal';
    }, 500);
  }
}

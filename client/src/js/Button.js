/**
 * @class Button
 */
export default class Button {
  /**
   * Crée un bouton
   *
   * @param {Object} settings
   * @param {string} settings.type Le type de bouton
   * @param {string} [settings.id] L'ID du bouton
   * @param {string[]} [settings.classNames] Les classes du bouton
   * @param {string} [settings.content] Le texte du bouton
   *
   * @returns {HTMLButtonElement}
   */
  static create(settings) {
    const {
      type,
      id,
      classNames,
      content,
    } = settings;

    const button = document.createElement('button');
    button.type = type;

    if (id) button.id = id;

    if (classNames) button.classList.add(...classNames);

    if (content) button.textContent = content;

    return button;
  }

  /**
   * Crée un bouton de type 'button'
   *
   * @param {Object} settings
   * @param {string} [settings.id] L'ID du bouton
   * @param {string[]} [settings.classNames] Les classes du bouton
   * @param {string} [settings.content] Le texte du bouton
   *
   * @returns {HTMLButtonElement}
   */
  static button(settings) {
    return Button.create({
      ...settings,
      type: 'button',
    });
  }

  /**
   * Crée un bouton de type 'submit'
   *
   * @param {Object} settings
   * @param {string} [settings.id] L'ID du bouton
   * @param {string[]} [settings.classNames] Les classes du bouton
   * @param {string} [settings.content] Le texte du bouton
   *
   * @returns {HTMLButtonElement}
   */
  static submit(settings) {
    return Button.create({
      ...settings,
      type: 'submit',
    });
  }
}

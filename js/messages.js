import { body } from './main.js';

// Классы всех сообщений и соответствующих им кнопок
const MESSAGECLASSES = {
  success: {
    section: '.success',
    button: '.success__button'
  },
  error: {
    section: '.error',
    button: '.error__button'
  },
  downloadError: {
    section: '.download-error-section',
    button: '.error__button'
  }
};

// Основной класс сообщения
class Message {
  constructor(template, messageClasses) {
    this.shown = false;
    this.messageTemplate = template;
    this.messageInfo = messageClasses;
  }

  setMessageShown = (value) => {
    this.shown = value;
  };

  getMessageShowen = () => this.shown;

  showMessage = (cb, setter) => {
    this.setMessageShown(true);
    const message = this.messageTemplate.cloneNode(true);
    const button = message.querySelector(this.messageInfo.button);
    if (this.getMessageShowen()) {
      body.appendChild(message);
    }
    const onDownload = () => {
      cb(setter);
      this.closeMessage(this.messageInfo.section);
    };

    button.addEventListener('click', onDownload);
  };

  closeMessage = (sectionClass) => {
    this.setMessageShown(false);
    const message = document.querySelector(`body > section${sectionClass}`);
    if (message) {
      message.remove();
    }
  };

  deleteEventListeners = (listeners) => {
    if (Array.isArray(listeners)) {
      if (Array.isArray(listeners[0])) {
        listeners.forEach(([event, func]) => document.removeEventListener(event, func));
      } else {
        const [event, func] = listeners;
        document.removeEventListener(event, func);
      }
    }
  };
}

// Класс для сообщений с особенностями закрытия
class UploadMessage extends Message {
  constructor(templateSuccess, templateError, messageClassesSuccess, messageClassesError) {
    super(templateSuccess, messageClassesSuccess);
    this.messageTemplateError = templateError;
    this.messageInfoError = messageClassesError;
    this.active = '';
  }

  showMessage = (messageCloseCb, success = true) => {
    this.setMessageShown(true);
    this.active = (success) ? this.messageInfo : this.messageInfoError;
    let message = '';
    let section = '';
    let button = '';
    if (success) {
      message = this.messageTemplate.cloneNode(true);
      section = message.querySelector(this.messageInfo.section);
      button = message.querySelector(this.messageInfo.button);
    } else {
      message = this.messageTemplateError.cloneNode(true);
      section = message.querySelector(this.messageInfoError.section);
      button = message.querySelector(this.messageInfoError.button);
    }

    if (this.getMessageShowen()) {
      body.appendChild(message);
    }

    const onCloseMessage = () => {
      const sectionClass = (success) ? this.messageInfo.section : this.messageInfoError.section;
      this.closeMessage(sectionClass);
      if (this.active.section === MESSAGECLASSES.success.section) {
        this.deleteEventListeners(['keydown', messageCloseCb]);
      }
    };

    const onClickMessageClose = (evt) => {
      if (evt.target === section) {
        onCloseMessage();
      }
    };

    button.addEventListener('click', onCloseMessage);
    section.addEventListener('click', onClickMessageClose);
  };
}

export {Message, UploadMessage, MESSAGECLASSES};

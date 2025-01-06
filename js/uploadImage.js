import { UploadMessage, MESSAGECLASSES } from './messages.js';
import { body } from './main.js';

const picturePreview = document.querySelector('.img-upload__preview img');
const overlay = document.querySelector('.img-upload__overlay');
const inputPhotoLoader = document.querySelector('.img-upload__input');
const overlayCloseBtn = overlay.querySelector('.img-upload__cancel');
const commentOverlay = overlay.querySelector('.text__description');
const hashTags = overlay.querySelector('.text__hashtags');
const scalerSmaller = document.querySelector('.scale__control--smaller');
const scalerBigger = document.querySelector('.scale__control--bigger');
const scalerValue = document.querySelector('.scale__control--value');
const SCALERSTEP = 25;

const form = document.querySelector('.img-upload__form');
const submitter = form.querySelector('.img-upload__submit');
const sliderElement = document.querySelector('.effect-level__slider');
const sliderValue = document.querySelector('.effect-level__value');
const sliderEffects = document.querySelector('.effects__list');
const sliderContainer = document.querySelector('.img-upload__effect-level');

// Сообщения
const successTemplate = document.querySelector('#success').content;
const errorTemplate = document.querySelector('#error').content;


const uploadMessage = new UploadMessage(successTemplate, errorTemplate, MESSAGECLASSES.success, MESSAGECLASSES.error);

// Слайдер
let currentEffect = 'none';
sliderContainer.style.display = 'none';

const sliderOptions = {
  none: {
    settings: {
      range: {
        min: 0,
        max: 1
      },
      step: 0.1,
      start: 1
    },
    func: 'grayscale($)',
    units: ''
  },
  chrome: {
    settings: {
      range: {
        min: 0,
        max: 1
      },
      step: 0.1,
      start: 1
    },
    func: 'grayscale($)',
    units: ''
  },
  sepia: {
    settings: {
      range: {
        min: 0,
        max: 1
      },
      step: 0.1,
      start: 1
    },
    func: 'sepia($)',
    units: ''
  },
  marvin: {
    settings: {
      range: {
        min: 0,
        max: 100
      },
      step: 1,
      start: 100
    },
    func: 'invert($)',
    units: '%'
  },
  phobos: {
    settings: {
      range: {
        min: 0,
        max: 3
      },
      step: 0.1,
      start: 3
    },
    func: 'blur($)',
    units: 'px'
  },
  heat: {
    settings: {
      range: {
        min: 1,
        max: 3
      },
      step: 0.1,
      start: 3
    },
    func: 'brightness($)',
    units: ''
  }
};

noUiSlider.create(sliderElement, {
  range: {
    min: 10,
    max: 100
  },
  start: 100,
  step: 25
});

sliderElement.noUiSlider.on('update', () => {
  sliderValue.value = sliderElement.noUiSlider.get();
  if (currentEffect !== 'none') {
    picturePreview.style.filter = sliderOptions[currentEffect].func.replace('$', sliderValue.value + sliderOptions[currentEffect].units);
  } else {
    picturePreview.style.filter = '';
  }
});

const onChangeEffect = (evt) => {
  if (evt.target.name === 'effect') {
    currentEffect = evt.target.value;
    sliderElement.noUiSlider.updateOptions(sliderOptions[currentEffect].settings);
    if (currentEffect !== 'none') {
      sliderContainer.style.display = '';
    } else {
      sliderContainer.style.display = 'none';
    }
  }
};

sliderEffects.addEventListener('change', onChangeEffect);

// Форма загрузки изображения
const onKeyDown = (evt) => {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
};

const onChangeScale = () => {
  let value = /\d+/.exec(scalerValue.value);
  value = (parseInt(value, 10) < 100) ? parseFloat(`0.${value}`, 10) : 1;
  picturePreview.style.transform = `scale(${value})`;
};

const closeOverlay = () => {
  overlay.classList.add('hidden');
  body.classList.remove('modal-open');
  inputPhotoLoader.value = '';
  hashTags.textContent = '';
  commentOverlay.textContent = '';
  currentEffect = 'none';
  sliderContainer.style.display = 'none';
  sliderElement.noUiSlider.updateOptions(sliderOptions[currentEffect].settings);
};

const onKeyDownPopupClose = (evt) => {
  if (evt.key === 'Escape') {
    if (!uploadMessage.getMessageShowen()) {
      closeOverlay();
      uploadMessage.deleteEventListeners(['keydown', onKeyDownPopupClose]);
    } else {
      uploadMessage.closeMessage(uploadMessage.active.section);
      if (uploadMessage.active === MESSAGECLASSES.success) {
        uploadMessage.deleteEventListeners(['keydown', onKeyDownPopupClose]);
      }
    }
  }
};

const onClickPopupClose = () => {
  closeOverlay();
  overlayCloseBtn.removeEventListener('click', onClickPopupClose);
  document.removeEventListener('keydown', onKeyDownPopupClose);
};

const onScaleInc = () => {
  if (parseInt(scalerValue.value, 10) + SCALERSTEP <= 100) {
    const newValue = parseInt(scalerValue.value, 10) + SCALERSTEP;
    scalerValue.value = `${newValue}%`;
    scalerValue.dispatchEvent(new Event('change'));
  }
};

const onScaleDec = () => {
  if (parseInt(scalerValue.value, 10) - SCALERSTEP >= 25) {
    const newValue = parseInt(scalerValue.value, 10) - SCALERSTEP;
    scalerValue.value = `${newValue}%`;
    scalerValue.dispatchEvent(new Event('change'));
  }
};

// Загружается фото
inputPhotoLoader.addEventListener('change', (evt) => {
  picturePreview.src = URL.createObjectURL(evt.target.files[0]);
  overlay.classList.remove('hidden');
  body.classList.add('modal-open');
  commentOverlay.addEventListener('keydown', onKeyDown);
  hashTags.addEventListener('keydown', onKeyDown);
  overlayCloseBtn.addEventListener('click', onClickPopupClose);
  document.addEventListener('keydown', onKeyDownPopupClose);
  scalerBigger.addEventListener('click', onScaleInc);
  scalerSmaller.addEventListener('click', onScaleDec);
  scalerValue.addEventListener('change', onChangeScale);
});

const clearImageUploadForm = (closePopup = false) => {
  scalerValue.value = '100%';
  sliderValue.value = 'none';
  picturePreview.style.filter = '';
  sliderContainer.style.display = 'none';
  hashTags.value = '';
  commentOverlay.value = '';
  inputPhotoLoader.value = null;

  scalerValue.dispatchEvent(new Event('change'));
  sliderEffects.dispatchEvent(new Event('change'));
  if (closePopup) {
    closeOverlay();
  }
};

export {form, submitter, clearImageUploadForm, onKeyDownPopupClose, uploadMessage};

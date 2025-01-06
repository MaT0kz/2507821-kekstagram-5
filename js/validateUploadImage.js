import {sendImage} from './requests.js';
import { form as uploadForm, submitter, clearImageUploadForm, onKeyDownPopupClose } from './uploadImage.js';
import { body } from './main.js';

// Объекты настроек для валидации хэш-тегов
const VALIDATE_HASH_TAGS = {
  regExp: /^#[a-zа-яё0-9]{1,19}$/i,
  validHashTag: {
    func: (value) => {
      if (value) {
        value = value.trim().split(/\s+/);
        return value.every((hash) => VALIDATE_HASH_TAGS.regExp.test(hash));
      }
      return true;
    },
    message: 'Введён невалидный хэш-тег'
  },
  aLotOfHashTags: {
    func: (value) => {
      if (value) {
        value = value.trim().split(/\s+/);
        return value.length <= 5;
      }
      return true;
    },
    message: 'Превышено количество хэш-тегов'
  },
  repeatingHashTags: {
    func: (value) => {
      if (value) {
        value = value.trim().split(/\s+/);
        if (value.length >= 2) {
          const valueLower = value.map((item) => item.toLowerCase());
          const hashTagsValid = value.every((hash) => VALIDATE_HASH_TAGS.regExp.test(hash));
          const hashTagsUnique = value.length === value.filter((item, index) => valueLower.indexOf(item.toLowerCase()) === index).length;
          return hashTagsValid && hashTagsUnique;
        }
      }
      return true;
    },
    message: 'Хэш-теги повторяются'
  }
};

const SETTINGS = {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'validation_message--error',
  errorTextParent: 'img-upload__field-wrapper',
};

const overlay = document.querySelector('.img-upload__overlay');
const hashTags = overlay.querySelector('.text__hashtags');
const form = document.querySelector('.img-upload__form');

const data = {
  form: uploadForm,
  submitter: submitter,
  clearWindow: clearImageUploadForm,
  body: body,
  popupClose: onKeyDownPopupClose
};

// Валидация
const pristine = new Pristine(form, SETTINGS);
pristine.addValidator(hashTags, VALIDATE_HASH_TAGS.validHashTag.func, VALIDATE_HASH_TAGS.validHashTag.message, 3, true);
pristine.addValidator(hashTags, VALIDATE_HASH_TAGS.repeatingHashTags.func, VALIDATE_HASH_TAGS.repeatingHashTags.message, 2, true);
pristine.addValidator(hashTags, VALIDATE_HASH_TAGS.aLotOfHashTags.func, VALIDATE_HASH_TAGS.aLotOfHashTags.message, 1, true);

form.addEventListener('submit', (evt) => {
  evt.preventDefault();
  if (pristine.validate()) {
    sendImage(data);
  }
});

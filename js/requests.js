import { Message, MESSAGECLASSES } from './messages.js';
import { addFilterFunctions, debouncedShowPhotos } from './utils.js';
import { uploadMessage } from './uploadImage.js';

const url = 'https://29.javascript.htmlacademy.pro/kekstagram/data';
const downloadErrorTemplate = document.querySelector('#download-error').content;
const downloadMessage = new Message(downloadErrorTemplate, MESSAGECLASSES.downloadError);

const sendImage = async (data) => {
  try {
    data.submitter.disabled = true;
    const requestData = new FormData(data.form);
    requestData.set('hashtags', requestData.get('hashtags').trim().split(/\s+/).join(' '));

    const response = await fetch('https://29.javascript.htmlacademy.pro/kekstagram', {
      method: 'post',
      body: requestData
    });
    if (!response.ok) {
      throw new Error('Ошибка запроса');
    }
    data.clearWindow(true);
    uploadMessage.showMessage(data.popupClose);
  } catch (err) {
    uploadMessage.showMessage(data.popupClose, false);
  }
  data.submitter.disabled = false;
};

const downloadImages = async (setter) => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      setter(data);
      downloadMessage.closeMessage();
      addFilterFunctions(debouncedShowPhotos);
    }
  } catch (err) {
    downloadMessage.showMessage(downloadImages, setter);
  }
};

export {sendImage, downloadImages};

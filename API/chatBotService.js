import React from 'react';
import clsSetting from '../API/clsSettings';

exports.postChatText = async (_prompt, _tempIndex) => {
  return fetch(clsSetting.APIUrl + "generate-text", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json', 
      'ngrok-skip-browser-warning': 'true',
    },
    body: JSON.stringify({
      prompt: _prompt || "", 
      tempIndex: _tempIndex || "", 
    }),
  })
    .then(function (response) {
      if (response.ok || response.status === 200) {
        return response.json();
      } else {
        console.log("postChatText Response status not OK:", response.status);
        return false;
      }
    })
    .then(function (json) {
      // console.log('chatBotService postChatText success: ', json);
      return json;
    })
    .catch((e) => {
      console.log('chatBotService postChatText Error : ', e);
    });
};


exports.postChatFile = async (_prompt, _fileUpload, _tempIndex) => {
  var formData = new FormData();
  formData.append("prompt", _prompt || "");
  formData.append("tempIndex", _tempIndex);

  if (_fileUpload) {
    if (_fileUpload.file instanceof File || _fileUpload.file instanceof Blob) {
      formData.append("fileUpload", _fileUpload.file);
    } 
    else if (_fileUpload.uri && _fileUpload.uri.startsWith('blob:')) {
      const response = await fetch(_fileUpload.uri);
      const blob = await response.blob();
      formData.append("fileUpload", blob, _fileUpload.name || "upload.txt");
    } 
    else {
      formData.append("fileUpload", {
        uri: _fileUpload.uri,
        name: _fileUpload.name || "upload.jpg",
        type: _fileUpload.mimeType || "image/jpeg",
      });
    }
  }

//   for (let pair of formData.entries()) {
//     console.log('FormData Content:', pair[0], pair[1]);
//   }

  return fetch(clsSetting.APIUrl + "generate-from-image", {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'ngrok-skip-browser-warning': 'true',
    },
    body: formData
    })
    .then(function(response) {
        if (response.ok || response.status === 200) {
            return response.json();
        } else {
            console.log("Response status not OK:", response.status);
            return false;
        }
    })
    .then(function(json) {
        // console.log('chatBotService postChatFile success: ', json);
        return json; 
    })
    .catch(e => {
        console.log('chatBotService postChatFile Error : ', e);
    });
};
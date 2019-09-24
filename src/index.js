"use strict";
import "./index.css";
import {Api} from './scripts/api.js';
import {Cardlist} from './scripts/cardList.js';
import {ProfileEditPopup, userName, userJob, userInfoJob, userInfoName} from './scripts/profileEditPopup';
import {CardAddPopup} from './scripts/cardAddPopup';
import {buttonHandler} from './scripts/validation.js';

const serverUrl = NODE_ENV === 'development' ? 'http://praktikum.tk/cohort2' : 'https://praktikum.tk/cohort2'

const placesList = document.querySelector('.places-list');
const popUpCard = document.querySelector('#popup-card');
const popUpEdit = document.querySelector('#popup-user');

const formNew = document.forms.new;
const formEdit = document.forms.edit;
const cardNewName = formNew.elements.nameCard;
const cardNewImage = formNew.elements.link;

const TOKEN = '0270fa99-f82c-4c01-a14b-b0c2e8baaa85';

const profileEditPopup = new ProfileEditPopup (popUpEdit);
const cardAddPopup = new CardAddPopup (popUpCard);
const cardList = new Cardlist (placesList, [])

export const api = new Api({
  baseUrl: serverUrl,
  headers: {
    authorization: TOKEN,
  }
});


api.getUserName()
  .then( user => {
    userInfoName.textContent = user.name;
    userInfoJob.textContent = user.about;
    document.querySelector('.user-info__name').setAttribute('data-user_id', user._id)
  })
  .catch( (err) => {
    console.log(err);
  });

api.getInitialCards()
  .then ( initialCards => {
    initialCards.forEach( (card) => {
      cardList.addCard(card);
    });
  })
  .catch( (err) => {
    console.log(err);
  });

function addUserCard (event) {
  event.preventDefault();
  cardAddPopup.renderLoading(true);
  api.sendUserCard(cardNewName.value, cardNewImage.value)
    .then ( (res) => {
      cardList.addCard(res);
      formNew.reset();
      cardAddPopup.close();
    })
    .catch( (err) => {
      console.log(err);
    })
    .finally ( () => {
      cardAddPopup.renderLoading(false);
    });
}

function editUserInfo (event){
  event.preventDefault();
  profileEditPopup.renderLoading(true);
  userInfoName.textContent = userName.value;
  userInfoJob.textContent = userJob.value;
  api.sendProfileInfo(userName.value, userJob.value)
    .then ( () => {
        profileEditPopup.close()
    })
    .catch( (err) => {
      console.log(err);
    })
    .finally ( () => {
      profileEditPopup.renderLoading(false);
    })
}


formNew.addEventListener('submit', addUserCard);
formEdit.addEventListener('submit', editUserInfo);
formNew.addEventListener('input',  buttonHandler);
formEdit.addEventListener('input', buttonHandler);

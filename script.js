"use strict";
class Card {
  constructor(cardArray) {
    this.cardElement = this.create(cardArray.name, cardArray.link, cardArray.owner._id)
    this.likeQuantity (cardArray.likes);
    this._id = cardArray._id;

    this.like = this.like.bind(this);
    this.remove = this.remove.bind(this);
    this.image = this.cardElement.querySelector('.place-card__image');

    this.checkCardOwner();
    
    this.cardElement.querySelector('.place-card__like-icon').addEventListener('click', this.like);
    this.cardElement.querySelector('.place-card__image').addEventListener('click', (event) =>  {
      if (event.target.classList.contains('place-card__image')) {
        new ImagePopup(this.image);
      }
    });
  }

  create (name, link, ownerId) {
    const card = document.createElement('div');
    card.classList.add('place-card');
    card.innerHTML = `
      <div class="place-card__image">
        <button class="place-card__delete-icon"></button>
      </div>
      <div class="place-card__description">
        <h3 class="place-card__name"></h3>
        <label>
          <button class="place-card__like-icon"></button>
          <p class="place-card__like-quantity"></p>
        </label>
      </div>`;
    const cardName = card.querySelector('.place-card__name');
    const cardImage = card.querySelector('.place-card__image');
    cardName.textContent = name;
    cardImage.setAttribute('style', `background-image: url(${link})`);
    card.setAttribute('data-ownerid', ownerId);
    return card;
  }

  like () {
    const likeIcon = this.cardElement.querySelector('.place-card__like-icon');
    likeIcon.classList.toggle('place-card__like-icon_liked');
  }

  remove () {
    const card = this.cardElement.closest('.place-card');
    if (window.confirm('Вы действительно хотите удалить эту карточку?')){
      api.deleteCard(this._id)
      .then ( () => {
          return card.parentNode.removeChild(card);        
      })      
      .catch((err) => {
        console.log(err);
      });
    } 
  }

  checkCardOwner() {
		if (this.cardElement.dataset.ownerid === document.querySelector('.user-info__name').dataset.user_id) {
			this.cardElement.querySelector('.place-card__delete-icon').style.display = 'block';
			this.cardElement.querySelector('.place-card__delete-icon')
				.addEventListener('click', this.remove.bind(this));
		}
	}

  likeQuantity (cardLikes) {
    const likeNumber = this.cardElement.querySelector('.place-card__like-quantity');
    if (cardLikes.length > 0) {
      this.like();
      likeNumber.textContent = cardLikes.length;
    } else {
      likeNumber.textContent = "";
    }
  }
}

class Cardlist {
  constructor(container, cardArray) {
    this.container = container;
  }

  addCard (cardArray) {
    const { cardElement } = new Card(cardArray);
    this.container.appendChild(cardElement);
  }

}

class Popup {
  constructor(popUpItem) {
    this.element = popUpItem;
    this.element.querySelector('.popup__close').addEventListener('click', this.close.bind(this));
  }

  open() {
    this.element.classList.add('popup_is-opened'); 
  }

  close() {
    this.element.classList.remove('popup_is-opened'); 
  }

  checkOpenedForm () {
    const currentForm = this.element.querySelector('.popup__form');
    const inputs = Array.from(currentForm.querySelectorAll('.popup__input'));

    inputs.forEach(function(elem){resetError(elem)})
    checkButton(currentForm);
  }

  renderLoading(isLoading) {
    if (isLoading) {
      this.element.querySelector('.popup__button').textContent = 'Загрузка...';  
    } else {
      this.element.querySelector('.popup__button').textContent = 'Сохранить';
    }
  }

}

class ProfileEditPopup extends Popup {
  constructor(popUpItem) {
    super(popUpItem);
    document.querySelector('.user-info__button-edit').addEventListener('click', this.open.bind(this));
  }
    
  open() { 
    userName.value = userInfoName.textContent;
    userJob.value = userInfoJob.textContent;

    super.open();
    super.checkOpenedForm();   
  }

  close() {
    super.close();  
  }
  renderLoading(isLoading){
    super.renderLoading(isLoading);
  }
}

class CardAddPopup extends Popup {
  constructor(popUpItem) {
    super(popUpItem);
    document.querySelector('.user-info__button').addEventListener('click', this.open.bind(this));
  }

  open() {
    super.open();
    super.checkOpenedForm(); 
  }

  close() {
    super.close();  
  }
  renderLoading(isLoading){
    super.renderLoading(isLoading);
  }
}

class ImagePopup {
  constructor (image) {
    this.ImageToRoot = this.imgPopUpCreate(image);
    this.imageElement = this.ImageToRoot.querySelector('#popup-image');

    this.open ();
    this.imageElement.querySelector('.popup__close').addEventListener('click', this.close.bind(this));
  }

  imgPopUpCreate (image) {
    const imgTemplate = (imgSRC) => {
      return  `<div id = "popup-image" class = "popup">
                <div class = "popup__image-container">
                  <img class = "popup__image" src = ${imgSRC}>
                  <img class = "popup__close" src = "./images/close.svg">
                </div>
              </div>`
    }
    const imgURL = image.style.backgroundImage;
    const imgSRC = imgURL.substr(5, imgURL.length-7);
    rootBlock.insertAdjacentHTML("beforeend", imgTemplate (imgSRC));
    return rootBlock;
  }

  open() {
    this.imageElement.classList.add('popup_is-opened');
  }

  close() {
    this.imageElement.classList.remove('popup_is-opened');
    rootBlock.removeChild(this.imageElement); 
  }
}

class Api {
  constructor(options) {
    this.header = options.headers;
    this.url = options.baseUrl;
    this.token = options.headers.authorization;
  }

  getResponseData(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  } 

  getUserName() {
    return  fetch(this.url + '/users/me', {
      headers: {
        authorization: this.token
      }
    })
    .then((res) => {
      return this.getResponseData(res);
    });
  }

  getInitialCards() {
    return fetch(this.url + '/cards', {
      headers: {
        authorization: this.token
      }
    })
    .then(res => {
      return this.getResponseData(res);
    });
  }

  sendProfileInfo (userName, userAbout) {
    return fetch(this.url + '/users/me', {
      method: 'PATCH',
      headers: {
          authorization: this.token,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          name: userName,
          about: userAbout
      })
    })
    .then(res => {
      return this.getResponseData(res);
    });
  }

  sendUserCard (userName, cardLink) {
    return fetch(this.url + '/cards', {
      method: 'POST',
      headers: {
          authorization: this.token,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          name: userName,
          link: cardLink
      })
    })
    .then(res => {
      return this.getResponseData(res);
    });
  }

  deleteCard (cardId) {
    return fetch(this.url + '/cards/' + cardId, {
      method: 'DELETE',
      headers: {
          authorization: this.token
      }
    })
    .then(res => {
      return this.getResponseData(res);
    }); 
  }

}

const placesList = document.querySelector('.places-list');

const popUpCard = document.querySelector('#popup-card');
const popUpEdit = document.querySelector('#popup-user');

const formNew = document.forms.new;
const formEdit = document.forms.edit;
const userName = formEdit.elements.nameUser;
const userJob = formEdit.elements.job;
const cardNewName = formNew.elements.nameCard;
const cardNewImage = formNew.elements.link;

const userInfoData = document.querySelector('.user-info__data');
const userInfoName = userInfoData.querySelector('.user-info__name');
const userInfoJob = userInfoData.querySelector('.user-info__job');
const rootBlock = document.querySelector('.root');

const TOKEN = '0270fa99-f82c-4c01-a14b-b0c2e8baaa85';
const urlbase = 'http://95.216.175.5';
const cohortId = 'cohort2';

const profileEditPopup = new ProfileEditPopup (popUpEdit);
const cardAddPopup = new CardAddPopup (popUpCard);
const cardList = new Cardlist (placesList, [])

const api = new Api({
  baseUrl: (urlbase + '/' + cohortId),
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




/*
  Хорошая работа, все сделанный функционал работает без ошибок, отлично, что все изменения
  на странице производятся только после ответа сервера.
  
  Но к организации кода есть некоторые замечания, которые нужно исправить:

  - не создавать экземпляр Api для каждого запроса, а создать один передав в его конструктор только
  базовый url, а не весь url запроса

  - перенести обработку ошибок из классак api в место где вызываются методы

*/

// Спасибо, получил комментарии по тем местам, которые вызывали вопросы. 


/*
  Отлично, все правки сделаны верно. Только метод getResponseData нужно вызывать 
  через this.

  Если у Вас будет свободное время попробуйте переписать работу с сервером
  применив async/await для работы с асинхронными запросами.
  https://learn.javascript.ru/async-await
  https://habr.com/ru/company/ruvds/blog/414373/

*/
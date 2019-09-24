import {ImagePopup} from './imagePopup.js';
import {api} from '../index.js';
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

  export {Card};
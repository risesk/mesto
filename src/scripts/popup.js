import {checkButton, resetError} from './validation.js';
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

  export {Popup};
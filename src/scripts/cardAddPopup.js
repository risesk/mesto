import {Popup} from './popup.js';

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

  export {CardAddPopup};
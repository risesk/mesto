import {Card} from './card.js';

class Cardlist {
    constructor(container, cardArray) {
      this.container = container;
    }
  
    addCard (cardArray) {
      const { cardElement } = new Card(cardArray);
      this.container.appendChild(cardElement);
    }
  
  }

  export {Cardlist};
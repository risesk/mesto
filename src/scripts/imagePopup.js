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
      const rootBlock = document.querySelector('.root');
      rootBlock.insertAdjacentHTML("beforeend", imgTemplate (imgSRC));
      return rootBlock;
    }
  
    open() {
      this.imageElement.classList.add('popup_is-opened');
    }
  
    close() {
      this.imageElement.classList.remove('popup_is-opened');
      document.querySelector('.root').removeChild(this.imageElement); 
    }
  }

  export {ImagePopup};
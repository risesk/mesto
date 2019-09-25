import {Popup} from './popup.js';

const userName = document.forms.edit.elements.nameUser;
const userJob = document.forms.edit.elements.job;
const userInfoData = document.querySelector('.user-info__data');
const userInfoName = userInfoData.querySelector('.user-info__name');
const userInfoJob = userInfoData.querySelector('.user-info__job');

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

  export {ProfileEditPopup, userName, userJob, userInfoJob, userInfoName};
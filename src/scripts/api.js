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

  export {Api};
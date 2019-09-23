// Валидация форм
function buttonHandler(event) {
  const currentForm = event.currentTarget.closest('.popup__form');
  handleValidate(event);
  checkButton(currentForm);
}
  
function handleValidate(event) {
  resetError(event.target);
  validate(event.target);
}

function validate(element) {
  const errorElement = document.querySelector(`#error-${element.id}`);
  if (element.type ==='text') {
    checkTextInput (element, errorElement);
    return false
  } else if (element.type ==='url') {
    checkUrlInput (element, errorElement);
    return false
  }
  return true
}

function checkTextInput (element, errorElement) {
  if (element.value.length ===0){
    errorElement.textContent = "Это обязательное поле";
    activateError(errorElement);
  } else if (element.value.length === 1 || element.value.length > 30) {
    errorElement.textContent = "Должно быть от 2 до 30 символов";
    activateError(errorElement);
  }
}

function checkUrlInput (element, errorElement) {
  if (!element.checkValidity()) {
    errorElement.textContent = "Здесь должна быть ссылка";
    activateError(errorElement);
  }
}

function activateError(element) {
  element.parentNode.classList.add('input-container__invalid');
}

function resetError(element) {
  element.parentNode.classList.remove('input-container__invalid');
  element.textContent = '';
}

function checkButton(currentForm) {
  const currentButton = currentForm.querySelector('.button')
  const inputs = Array.from(currentForm.elements);

  let isValidForm = true;

  inputs.forEach((elem) => {
    if (!elem.checkValidity()) isValidForm = false;
  });

  if (isValidForm) {
    currentButton.removeAttribute('disabled');
    currentButton.classList.add('popup__button_is-active');
  } else {
    currentButton.setAttribute('disabled', true);
    currentButton.classList.remove('popup__button_is-active');
  }
}


formNew.addEventListener('submit', addUserCard);
formEdit.addEventListener('submit', editUserInfo);
formNew.addEventListener('input',  buttonHandler);
formEdit.addEventListener('input', buttonHandler);
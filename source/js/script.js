'use strict';

(function () {

  var MessageError = 'Ошибка: обязательное поле';
  var PhoneError = 'Заполните поле в формате + 7 (999) 999 99 99';

  var createFocusTrap = window.createFocusTrap;
  var onPhoneInputKeydown = window.usePhoneMask;

  var body = document.querySelector('body');
  var callBackLink = document.querySelector('#callback_link');
  var callBackModal = document.querySelector('.call-request');
  var callBackForm = callBackModal.querySelector('.callback__form');
  var nameInput = callBackForm.querySelector('#name-field');
  var phoneInput = callBackForm.querySelector('#phone-field');
  var checkboxInput = callBackForm.querySelector('#agreement-field');

  var successModal = document.querySelector('.success');
  var successModalButton = successModal.querySelector('.success__button');

  var goPhoneInput = document.querySelector('#go-phone-field');
  var detailsPhoneInput = document.querySelector('#details-phone-field');

  var callBackFocusTrap = createFocusTrap(callBackModal);
  var successFocusTrap = createFocusTrap(successModal);

  var isStorageSupport = true;
  var storage = '';
  var storageTel = '';

  /* Проверка доступности localStorage  */

  try {
    storage = localStorage.getItem('name');
    storageTel = localStorage.getItem('phone');
  } catch (err) {
    isStorageSupport = false;
  }

  // Маска для полей номера телефона

  goPhoneInput.removeEventListener('keydown', onPhoneInputKeydown);
  detailsPhoneInput.removeEventListener('keydown', onPhoneInputKeydown);


  /* Слушатель события клика по ссылке Заказать звонок */

  if (callBackLink) {
    callBackLink.addEventListener('click', function (evt) {
      evt.preventDefault();

      openCallBack();
    });
  }

  /* Функция открытия поп-апа */

  var openModal = function (modal, closeFunction, focusTrap) {
    if (modal.classList.contains('modal--closed')) {
      modal.classList.remove('modal--closed');

      body.dataset.scrollY = getBodyScrollTop(); // сохраним значение скролла

      var modalCloseButton = modal.querySelector('.modal__close');
      modalCloseButton.addEventListener('click', closeFunction);

      focusTrap.activate();

      body.classList.add('body-lock');

      if (existVerticalScroll()) {
        body.style.top = '-' + body.dataset.scrollY + 'px';
      }
    }
  };

  /* Функция закрытия поп-апа */

  var closeModal = function (modal, closeFunction, focusTrap) {
    if (!modal.classList.contains('modal--closed')) {
      modal.classList.add('modal--closed');
      var modalCloseButton = modal.querySelector('.modal__close');
      modalCloseButton.removeEventListener('click', closeFunction);

      focusTrap.deactivate();

      body.classList.remove('body-lock');

      if (existVerticalScroll()) {
        window.scrollTo(0, +body.dataset.scrollY);
      }
    }
  };

  /* Функция закрытия поп-апа Заказать звонок при клике на оверфлоу */

  var onCallBackOverflowClick = function (evt) {
    if (evt.target === callBackModal) {
      closeCallBack();
    }
  };

  /* Функция закрытия поп-апа Заказать звонок при нажатии на Escape */

  var onCallBackKeydown = function (evt) {
    if (evt.key === 'Escape') {
      closeCallBack();
    }
  };

  /* Функция закрытия поп-апа Заявка принята при клике на оверфлоу */

  var onSuccessModalOverflowClick = function (evt) {
    if (evt.target === successModal) {
      closeSuccessModal();
    }
  };

  /* Функция закрытия поп-апа Заявка принята при нажатии на Escape */

  var onSuccessModalKeydown = function (evt) {
    if (evt.key === 'Escape') {
      closeSuccessModal();
    }
  };

  /* Функция закрытия поп-апа Заявка принята при нажатии на кнопку Понятно */

  var onSuccessModalButtonClick = function (evt) {
    evt.preventDefault();
    closeSuccessModal();
  };

  /* Функция отправки формы */

  var onFormSubmit = function (evt) {
    evt.preventDefault();
    openSuccessModal();

    if (isStorageSupport) {
      localStorage.setItem('name', nameInput.value);
      localStorage.setItem('phone', phoneInput.value);
    }
  };

  var onCallBackFormSubmit = function (evt) {
    if (!nameInput.value) {
      setInvalidMode(nameInput, MessageError);
    }
    if (!phoneInput.value) {
      setInvalidMode(phoneInput, MessageError);
    }
    if (!checkboxInput.checked) {
      setInvalidMode(checkboxInput, MessageError);
    }
    if (nameInput.value && phoneInput.value && checkboxInput.checked) {
      closeCallBack();
      onFormSubmit(evt);
    }
  };

  /* Функция открытия поп-апа Заказать звонок */

  var openCallBack = function () {
    openModal(callBackModal, closeCallBack, callBackFocusTrap);
    callBackModal.addEventListener('click', onCallBackOverflowClick);
    document.addEventListener('keydown', onCallBackKeydown);
    phoneInput.addEventListener('keydown', onPhoneInputKeydown);
    callBackForm.addEventListener('submit', onCallBackFormSubmit);
    nameInput.addEventListener('input', onInput);
    phoneInput.addEventListener('keyup', onInput);
    checkboxInput.addEventListener('change', onCheckboxChange);

    if (isStorageSupport) {
      if (storage) {
        nameInput.value = storage;
        nameInput.focus();
      }
      if (storageTel) {
        phoneInput.value = storageTel;
      }
    } else {
      nameInput.focus();
    }
  };

  /* Функция закрытия поп-апа Заказать звонок */

  var closeCallBack = function () {
    closeModal(callBackModal, closeCallBack, callBackFocusTrap);
    callBackModal.removeEventListener('click', onCallBackOverflowClick);
    document.removeEventListener('keydown', onCallBackKeydown);
    phoneInput.removeEventListener('keydown', onPhoneInputKeydown);
    callBackForm.removeEventListener('submit', onCallBackFormSubmit);
    nameInput.removeEventListener('input', onInput);
    phoneInput.removeEventListener('keyup', onInput);
    checkboxInput.removeEventListener('change', onCheckboxChange);
  };


  /* Функция открытия поп-апа Заявка принята */

  var openSuccessModal = function () {
    openModal(successModal, closeSuccessModal, successFocusTrap);
    successModal.addEventListener('click', onSuccessModalOverflowClick);
    document.addEventListener('keydown', onSuccessModalKeydown);
    successModalButton.addEventListener('click', onSuccessModalButtonClick);
  };

  /* Функция закрытия поп-апа Заявка принята */

  var closeSuccessModal = function () {
    closeModal(successModal, closeCallBack, successFocusTrap);
    successModal.removeEventListener('click', onSuccessModalOverflowClick);
    document.removeEventListener('keydown', onSuccessModalKeydown);
    successModalButton.removeEventListener('click', onSuccessModalButtonClick);
  };

  /* Получение положения на странице при открытии поп-апа */

  var existVerticalScroll = function () {
    return document.body.offsetHeight > window.innerHeight;
  };

  var getBodyScrollTop = function () {
    return (
      self.pageYOffset ||
      (document.documentElement && document.documentElement.ScrollTop) ||
      (document.body && document.body.scrollTop)
    );
  };

  // Генерирует сообщение об ошибке

  var getErrorElement = function (error) {
    var errorTemplate = document.querySelector('#callback__error')
        .content
        .querySelector('.callback__error-message');
    var errorElement = errorTemplate.cloneNode(true);
    errorElement.textContent = error;

    return errorElement;
  };

  // Проверяет поле при вводе

  var onInput = function (evt) {
    var input = evt.target;
    var message;

    if (input.validity.valueMissing) {
      message = MessageError;
      setInvalidMode(input, message);
      input.reportValidity();
      return false;
    } else if (evt.target.validity.patternMismatch) {
      message = PhoneError;
      setInvalidMode(input, message);
      input.reportValidity();
      return false;
    } else {
      message = '';
      setValidMode(input);
      input.reportValidity();
      return true;
    }
  };

  // Проверяет чекбокс

  var onCheckboxChange = function (evt) {
    var checkbox = evt.target;
    var message;

    if (checkbox.checked !== true) {
      message = MessageError;
      setInvalidMode(checkbox, message);
      checkbox.reportValidity();
      return false;
    } else {
      message = '';
      setValidMode(checkbox);
      checkbox.reportValidity();
      return true;
    }
  };

  // Устанавливает ошибку

  var setInvalidMode = function (element, message) {
    var inputBlock = element.parentNode;
    var inputError = inputBlock.querySelector('.callback__error-message');
    element.setCustomValidity(message);
    if (!inputBlock.classList.contains('callback__input-field--checkbox')) {
      inputBlock.classList.add('callback__input-field--error');
    }
    if (inputError) {
      inputBlock.removeChild(inputError);
    }
    inputBlock.appendChild(getErrorElement(message));
  };

  // Убирает ошибку

  var setValidMode = function (element) {
    var inputBlock = element.parentNode;
    var inputError = inputBlock.querySelector('.callback__error-message');
    element.setCustomValidity('');
    if (!inputBlock.classList.contains('callback__input-field--checkbox')) {
      inputBlock.classList.remove('callback__input-field--error');
    }
    if (inputError) {
      inputBlock.removeChild(inputError);
    }
  };

})();

'use strict';

(function () {

  var MessageError = 'Ошибка: обязательное поле';
  var PhoneError = 'Формат поля: + 7 (999) 999 99 99';

  var ActiveTabClass = 'programs__programs-item--active';
  var ActiveTabLinkClass = 'programs__tabs-link--active';

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

  var goForm = document.querySelector('#go-form');
  var goPhoneInput = goForm.querySelector('#go-phone-field');

  var detailsForm = document.querySelector('#details-form');
  var detailsNameInput = detailsForm.querySelector('#details-name-field');
  var detailsPhoneInput = document.querySelector('#details-phone-field');

  var callBackFocusTrap = createFocusTrap(callBackModal);
  var successFocusTrap = createFocusTrap(successModal);

  var isStorageSupport = true;
  var storage = '';
  var storageTel = '';

  var tabLinkList = document.querySelector('.programs__tabs-list');
  if (tabLinkList) {
    var tabLinks = tabLinkList.querySelectorAll('.programs__tabs-link');
  }
  var tabsList = document.querySelector('.programs__programs-list');

  var sliderLifeContainer = document.querySelector('.life__container');
  var sliderLifePagination = sliderLifeContainer.querySelector('.swiper-pagination');
  var sliderLifeWrapper = sliderLifeContainer.querySelector('.swiper-wrapper');

  var sliderReviewsContainer = document.querySelector('.reviews__container');

  var questionsList = document.querySelector('.questions__list');
  if (questionsList) {
    var questionsButtons = questionsList.querySelectorAll('.questions__question');
  }

  /* Проверка доступности localStorage  */

  try {
    storage = localStorage.getItem('name');
    storageTel = localStorage.getItem('phone');
  } catch (err) {
    isStorageSupport = false;
  }

  // Маска и форма для полей номера телефона

  if (goPhoneInput) {
    goPhoneInput.addEventListener('keydown', onPhoneInputKeydown);
    goPhoneInput.addEventListener('keyup', function (evt) {
      onInput(evt);
    });
  }

  if (goForm) {
    goForm.addEventListener('submit', function (evt) {
      onFormSubmit(evt);
    });
  }

  if (detailsPhoneInput) {
    detailsPhoneInput.addEventListener('keydown', onPhoneInputKeydown);
    detailsPhoneInput.addEventListener('keyup', function (evt) {
      onInput(evt);
    });
  }

  if (detailsForm) {
    detailsForm.addEventListener('submit', function (evt) {
      onFormSubmit(evt);
    });
  }

  if (detailsNameInput) {
    detailsNameInput.addEventListener('input', function (evt) {
      onInput(evt);
    });
  }

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
    if (evt.keyCode === 27) {
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
    if (evt.keyCode === 27) {
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

    var nameInputField = evt.target.querySelector('input[name="name"]');
    var phoneInputField = evt.target.querySelector('input[type="tel"]');

    if (isStorageSupport) {
      if (nameInputField) {
        localStorage.setItem('name', nameInputField.value);
      }
      localStorage.setItem('phone', phoneInputField.value);
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
    var span = document.createElement('span');
    span.className = 'callback__error-message';
    span.textContent = error;

    return span;
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

  /* Табы */

  if (tabsList) {
    tabsList.classList.remove('programs__programs-list--no-js');
  }

  // Функция переключения таба

  var onLinkClick = function (evt) {
    evt.preventDefault();
    var href;
    var linkSelector;

    var linksArray = Array.prototype.slice.call(tabLinks, 0);

    if (linksArray.indexOf(evt.target) >= 0) {
      href = '#' + evt.target.href.split('#')[1];
      linkSelector = '.programs__tabs-link[href$=' + evt.target.href.split('#')[1] + ']';
    } else {
      var parent = evt.target.parentElement;
      href = '#' + parent.href.split('#')[1];
      linkSelector = '.programs__tabs-link[href$=' + parent.href.split('#')[1] + ']';
    }

    var tab = tabsList.querySelector(href);
    var link = tabLinkList.querySelector(linkSelector);
    var activeTab = tabsList.querySelector('.' + ActiveTabClass);
    var activeTabLink = document.querySelector('.' + ActiveTabLinkClass);

    activeTab.classList.remove(ActiveTabClass);
    tab.classList.add(ActiveTabClass);
    activeTabLink.classList.remove(ActiveTabLinkClass);
    link.classList.add(ActiveTabLinkClass);
  };

  // Функция добавления обработчика собития на ссылку

  var addLinkClickHandler = function (link) {
    link.addEventListener('click', onLinkClick);
  };

  // Добавляем обработчики на все ссылки

  if (tabLinkList) {
    if (tabLinks.length !== 0) {
      for (var i = 0; i < tabLinks.length; i++) {
        addLinkClickHandler(tabLinks[i]);
      }
    }
  }

  // Добавляем слайдер

  if (sliderLifeWrapper) {
    sliderLifeWrapper.classList.remove('life__list--no-js');
  }

  var mySwiper = 0;

  var initSwiper = function () {
    var screenWidth = window.innerWidth;
    if ((screenWidth < (1024)) && (mySwiper === 0)) {
      sliderLifePagination.classList.remove('swiper-pagination-lock');
      mySwiper = new Swiper('.life__container', {
        slidesPerView: 'auto',
        spaceBetween: 30,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      });
    } else if ((screenWidth > 850) && (mySwiper !== 0)) {
      mySwiper.destroy();
      mySwiper = 0;
      sliderLifeContainer.classList.remove('swiper-container-initialized');
      sliderLifeContainer.classList.remove('swiper-container-horizontal');
      sliderLifePagination.classList.add('swiper-pagination-lock');
    }
  };

  if (sliderLifeContainer) {
    initSwiper();

    window.addEventListener('resize', function () {
      initSwiper();
    });
  }

  // Аккордеон

  if (questionsList) {
    questionsList.classList.remove('questions__list--no-js');
    var questionsButtonsArray = Array.prototype.slice.call(questionsButtons, 0);
  }

  var onQuestionsButtonClick = function (evt) {
    var element;

    if (questionsButtonsArray.indexOf(evt.target) >= 0) {
      element = evt.target;
    } else {
      element = evt.target.parentElement;
    }

    if (element.classList.contains('questions__question--active')) {
      element.classList.remove('questions__question--active');
    } else {
      var activeQuestionsButton = questionsList.querySelector('.questions__question--active');
      if (activeQuestionsButton) {
        activeQuestionsButton.classList.remove('questions__question--active');
      }
      element.classList.add('questions__question--active');
    }
  };

  // Функция добавления обработчика собития на кнопку аккордеона

  var addQuestionsButtonClickHandler = function (button) {
    button.addEventListener('click', onQuestionsButtonClick);
  };

  // Добавляем обработчики на все кнопки аккордеона

  if (questionsList) {
    if (questionsButtons.length !== 0) {
      for (var j = 0; j < questionsButtons.length; j++) {
        addQuestionsButtonClickHandler(questionsButtons[j]);
      }
    }
  }

  // Инициализируем слайдер блока Отзывы

  if (sliderReviewsContainer) {
    sliderReviewsContainer.classList.remove('reviews__container--no-js');

    var swiperReviews = new Swiper('.reviews__container', {
      pagination: {
        el: '.swiper-pagination',
        type: 'fraction',
      },
      navigation: {
        nextEl: '.reviews__button--next',
        prevEl: '.reviews__button--prev',
      },
    });
  }


})();

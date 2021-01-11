'use strict';

const dataBase = JSON.parse(localStorage.getItem('awito')) || [];
let сounter = dataBase.length;

const modalAdd = document.querySelector('.modal__add');
const addAd = document.querySelector('.add__ad');
const modalBtnSubmit = document.querySelector('.modal__btn-submit');
const modalSubmit = document.querySelector('.modal__submit');
const catalog = document.querySelector('.catalog');
const modalItem = document.querySelector('.modal__item');
const modalBtnWarning = document.querySelector('.modal__btn-warning');
const modalFileInput = document.querySelector('.modal__file-input');
const modalFileBtn = document.querySelector('.modal__file-btn');
const modalImageAdd = document.querySelector('.modal__image-add');

const srcModalImage = modalImageAdd.src;
const textFileBtn = modalFileBtn.textContent;

const modalImageItem = document.querySelector('.modal__image-item');
const modalHeaderItem = document.querySelector('.modal__header-item');
const modalStatusItem = document.querySelector('.modal__status-item');
const modalDescripitonItem = document.querySelector('.modal__description-item');
const modalCostItem = document.querySelector('.modal__cost-item');

const searchInput = document.querySelector('.search__input');
const menuContainer = document.querySelector('.menu__container');

const elementsModalSubmit = [...modalSubmit.elements].filter(
  (elem) => elem.tagName !== 'BUTTON' && elem.type !== 'submit',
);

const saveDB = () => localStorage.setItem('awito', JSON.stringify(dataBase));

const checkForm = () => {
  const validForm = elementsModalSubmit.every((elem) => elem.value);
  modalBtnSubmit.disabled = !validForm;
  modalBtnWarning.style.display = validForm ? 'none' : '';
};

const closeModal = (event) => {
  const target = event.target;

  if (
    target.closest('.modal__close') ||
    target.classList.contains('modal') ||
    event.code === 'Escape'
  ) {
    modalAdd.classList.add('hide');
    modalItem.classList.add('hide');
    document.removeEventListener('keydown', closeModal);
    modalSubmit.reset();
    modalImageAdd.src = srcModalImage;
    modalFileBtn.textContent = textFileBtn;
    checkForm();
  }
};

const renderCard = (DB = dataBase) => {
  catalog.textContent = '';

  DB.forEach((item) => {
    catalog.insertAdjacentHTML(
      'beforeend',
      `
      <li class="card" data-id="${item.id}">
        <img class="card__image" src="data:image/jpeg;base64,${item.image}" alt="test" />
        <div class="card__description">
          <h3 class="card__header">${item.nameItem}</h3>
          <div class="card__price">${item.costItem} ₽</div>
        </div>
      </li>
    `,
    );
  });
};

searchInput.addEventListener('input', () => {
  const valueSearch = searchInput.value.trim().toLowerCase();

  if (valueSearch.length > 2) {
    const result = dataBase.filter(
      (item) =>
        item.nameItem.toLowerCase().includes(valueSearch) ||
        item.descriptionItem.toLowerCase().includes(valueSearch),
    );

    renderCard(result);
  }
});

const infoPhoto = {};

modalFileInput.addEventListener('change', (event) => {
  const target = event.target;

  const reader = new FileReader();

  const file = target.files[0];

  infoPhoto.fileName = file.name;
  infoPhoto.fileSize = file.size;

  reader.readAsBinaryString(file);

  reader.addEventListener('load', (event) => {
    if (infoPhoto.fileSize < 200000) {
      modalFileBtn.textContent = infoPhoto.fileName;
      infoPhoto.base64 = btoa(event.target.result);
      modalImageAdd.src = `data:image/jpeg;base64,${infoPhoto.base64}`;
    } else {
      modalFileBtn.textContent = 'Файл не должен превышать 200Кб';
      modalFileInput.value = '';
      checkForm();
    }
  });
});

modalSubmit.addEventListener('submit', (event) => {
  event.preventDefault();
  const itemObject = {};

  for (const elem of elementsModalSubmit) {
    itemObject[elem.name] = elem.value;
    itemObject.id = сounter++;
  }

  itemObject.image = infoPhoto.base64;
  dataBase.push(itemObject);
  closeModal({ target: modalAdd });
  saveDB();
  renderCard();
});

modalSubmit.addEventListener('input', checkForm);

addAd.addEventListener('click', () => {
  modalAdd.classList.remove('hide');
  modalBtnSubmit.disabled = true;
  document.addEventListener('keydown', closeModal);
});

catalog.addEventListener('click', (event) => {
  const target = event.target;
  const card = target.closest('.card');

  if (card) {
    const item = dataBase.find((item) => item.id === +card.dataset.id);

    modalImageItem.src = `data:image/jpeg;base64,${item.image}`;
    modalHeaderItem.textContent = item.nameItem;
    modalStatusItem.textContent = item.status === 'new' ? 'Новый' : 'Б/У';
    modalDescripitonItem.textContent = item.descriptionItem;
    modalCostItem.textContent = item.costItem;

    modalItem.classList.remove('hide');
    document.addEventListener('keydown', closeModal);
  }
});

menuContainer.addEventListener('click', (event) => {
  const target = event.target;

  if (target.tagName === 'A') {
    const result = dataBase.filter((item) => item.category === target.dataset.category);

    renderCard(result);
  }
});

modalAdd.addEventListener('click', closeModal);
modalItem.addEventListener('click', closeModal);

renderCard();

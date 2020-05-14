const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const toggleModal = function () {
  modal.classList.toggle("is-open");
}



// day 1

const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const loginForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsClub = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const cart = [];
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-pricetag');
const btnClearCart = document.querySelector('.clear-cart');

let login = localStorage.getItem('gloDelivery');

const getData = async function (url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}`);
  }

  return await response.json();
}

const toggleModalAuth = function () {
  modalAuth.classList.toggle('is-open');
}

function autorized() {
  function logOut() {
    login = '';
    buttonAuth.style.display = 'block';
    userName.style.display = 'none';
    buttonOut.style.display = 'none';
    loginInput.value = '';
    checkAuth();
    buttonOut.removeEventListener('click', logOut);
    cartButton.style.display = 'none';
  }

  userName.textContent = login;
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex';

  buttonOut.addEventListener('click', logOut);
  console.log('Авторизован');
}

function notautorized() {
  function logIn(event) {
    event.preventDefault();
    if (loginInput.value != '') {
      login = loginInput.value;
      localStorage.setItem('gloDelivery', login);
      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      loginForm.removeEventListener('submit', logIn);
      loginForm.reset();
      checkAuth();
      toggleModalAuth();
    } else {
      console.log('Вы не вели логин');
    }
  }
  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  loginForm.addEventListener('submit', logIn);
  console.log('Не авторизован');
}

function checkAuth() {
  if (login) {
    autorized();
  } else {
    notautorized();
  }
}

checkAuth();

function createCardClub(restaurant) {

  const { image, kitchen, name, price, stars, products, time_of_delivery } = restaurant;

  const card = `
  <a class="card card-restaurant" data-product="${products}">
    <img src="${image}" alt="image" class="card-image" />
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">${name}</h3>
        <span class="card-tag tag">${time_of_delivery} мин</span>
      </div>
      <div class="card-info">
        <div class="rating">
         ${stars}
        </div>
        <div class="price">От ${price} ₽</div>
        <div class="category">${kitchen}</div>
      </div>
    </div>
  </a>`;

  cardsClub.insertAdjacentHTML('beforeend', card);
}

function createCardGood(goods) {
  const { description, id, image, name, price } = goods;
  const card = document.createElement('div');
  card.className = 'card';
  const cardCode = `
    <img src="${image}" alt="image" class="card-image" data-id="${id}"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">${description}
        </div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart" id="${id}">
					<span class="button-card-text">В корзину</span>
					<span class="button-cart-svg"></span>
				</button>
        <strong class="card-price-bold">${price} ₽</strong>
      </div>
    </div>
  `;
  card.insertAdjacentHTML('beforeend', cardCode);
  cardsMenu.insertAdjacentElement('beforeend', card);
}

function openGoods(event) {
  if (login) {
    const target = event.target;
    const restaurant = target.closest('.card-restaurant');

    if (restaurants) {
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');
      cardsMenu.textContent = '';
      getData(`./db/${restaurant.dataset.product}`).then(function (data) {
        data.forEach(createCardGood);
      });
    }
  } else {
    toggleModalAuth();
  }
}

function addToCart(event) {
  const target = event.target;
  const btnAddToCart = target.closest('.button-add-cart');
  if (btnAddToCart) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title').textContent;
    const price = card.querySelector('.card-price-bold').textContent;
    const id = btnAddToCart.id;
    const food = cart.find(function (item) {
      return item.id === id;
    });

    if (food) {
      food.count += 1;
    } else {
      cart.push({
        id: id,
        title: title,
        price: price,
        count: 1
      });
    }
  }
}

function renderCart() {
  modalBody.textContent = '';
  cart.forEach(function({ id, title, price, count }) {
    const itemCart = `
    <div class="food-row">
      <span class="food-name">${title}</span>
      <strong class="food-price">${price}</strong>
      <div class="food-counter">
        <button class="counter-button counter-remove" data-id="${id}">-</button>
        <span class="counter">${count}</span>
        <button class="counter-button counter-add" data-id="${id}">+</button>
      </div>
    </div>
    `;
    modalBody.insertAdjacentHTML('afterbegin', itemCart);
  });
  const totalPrice = cart.reduce(function(result, item) {
    return result + (parseFloat(item.price) * item.count);
  }, 0);

  modalPrice.textContent = totalPrice + ' Р';
}

function changeCount(event) {
  const target = event.target;
  if (target.classList.contains('counter-remove')) {
    const food = cart.find(function(item) {
      return item.id === target.dataset.id;
    });
    food.count--;
    if (food.count === 0) {
      cart.splice(cart.indexOf(food),1);
    }
    renderCart();
  }

  if (target.classList.contains('counter-add')) {
    const food = cart.find(function(item) {
      return item.id === target.dataset.id;
    });
    food.count++;
    renderCart();
  }
}

function init() {
  getData('./db/partners.json').then(function (data) {
    data.forEach(createCardClub);
  });
  cartButton.addEventListener('click', function() {
    renderCart();
    toggleModal();
  });
  modalBody.addEventListener('click', changeCount);
  btnClearCart.addEventListener('click', function() {
    cart.length = 0;
    renderCart();
  });
  cardsMenu.addEventListener('click', addToCart);
  close.addEventListener('click', toggleModal);
  cardsClub.addEventListener('click', openGoods);
  logo.addEventListener('click', function () {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
  });

  new Swiper('.swiper-container', {
    loop: true,
    sliderPerView: 1
  });
}

init();
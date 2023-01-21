// Import our custom CSS && Import all of Bootstrap's JS
import "../scss/styles.scss";
import * as bootstrap from "bootstrap";

import uploadOrder from "./services.js";

import {
  Product,
  products,
  filteredProducts,
  cart,
  User,
  Orders,
  categories,
} from "./mocked_data.js";

import {saveItem, getItem, removeItem, clearStorage} from './storage';

//Get AVAILABLE HTML ELEMENTS
let myCart = document.getElementById("cart-items");
const orderQuantity = document.getElementById("order-quantity");
const uploadBtn = document.getElementById("upload-products");
const orderPlacedCtn = document.getElementById("order-placed-ctn");
const orderPlacedCtnClose = document.getElementById("close-order-placed-ctn");
const notifyUsBtn = document.getElementById('notify-us');

//GLOBAL VALUES
let userDetails = null;
let orderLink = '';


//Hero products display lenght
const displayLenght = 5;

//Get containers to fill in elements
let heroProductsRow = document.getElementById("hero-products");


window.onload = () => {
  cart = getItem('cart') || [];
  if(cart.length > 0){
    cart.forEach(product =>{
      myCart.append(loadCartItems(product));
      setCartItemProps(product);
    });

    getTotalorderValue();
  }
  userDetails = getItem('userDetails') || null;
  orderQuantity.textContent = cart.length;
};


//Prodcts card template
let productCard = function LoadProducts(product) {
  return `<div class="col-sm-12" >
    <div class="col">
      <div class="card" style="width: 100%; border:none">
          <img src=${product.image} class="card-img-top" style="border-radius:0; height:400px; max-width:100%" alt="...">
          <div class="card-body text-start" >
          <div class="row" >
              <div class="col">
                  <h5 class="card-title">${product.title}</h5>
                  <p class="card-text">${product.weight}kg dresses weight</p>
                  <p class="card-text" style="font-weight: bold; font-size: 17px;">GHC70</p>
               
              </div>
              <div class="col">
                  <a  class="btn btn-success btn-lg" style="width: 150px;" id="add-to-cart-btn">Buy</a>
              </div>
          </div>
        
     
          </div>
        </div>
     
    </div>
    </div>`;
};

//Handle hero-products display
let selectedProductIndex = 0;
let selectedProduct = products[selectedProductIndex];
heroProductsRow.innerHTML = productCard(selectedProduct);
let heroProductsNavBtn = document.getElementById("hero-products-navigator");
heroProductsNavBtn.addEventListener("click", nextProduct);

//Show next product
function nextProduct() {
  const productsLength = displayLenght;
  if (selectedProductIndex < productsLength - 2) {
    selectedProductIndex += 1;
    selectedProduct = products.slice(0, displayLenght)[selectedProductIndex];
  } else {
    selectedProductIndex = 0;
    selectedProduct = products.slice(0, displayLenght)[selectedProductIndex];
  }

  //Toogle navigation
  const moreNavBtns = document.querySelectorAll("#flexRadioDefault1");
  moreNavBtns.forEach((btn, index) => {
    btn.checked = false;
    if (index == selectedProductIndex) {
      btn.checked = true;
    }
  });

  heroProductsRow.innerHTML = productCard(selectedProduct);

  //Add addToCartEvent to Button
  const addToCartBtns = document.querySelector("#add-to-cart-btn");
  addToCartBtns.addEventListener("click", () => {
    addToCart(products[selectedProductIndex]);
  });
}

//More products navigation
var moreProductsNavButtons = document.getElementById("more-products-btns-row");
function moreProductsBtnComponent() {
  return `<div class="form-check">
 <input class="form-check-input" type="radio" style="color: red"  name="flexRadioDefault" id="flexRadioDefault1">
</div>`;
}

products.slice(0, displayLenght).forEach((product) => {
  moreProductsNavButtons.innerHTML += moreProductsBtnComponent();
});
//Toogle navigation
const moreNavBtns = document.querySelectorAll("#flexRadioDefault1");
//Button action
function navToNextProduct() {
  selectedProduct = products[selectedProductIndex];
  heroProductsRow.innerHTML = productCard(selectedProduct);
}
moreNavBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    selectedProductIndex = index;
    navToNextProduct();
  });
});
moreNavBtns[0].checked = true;

//OTHER PRODUCTS LIST
let moreProductsRow = document.getElementById("more-products-row");
let moreProductCard = function loadMoreProducts(product) {
  return `
  <div class="col">
      <div class="card" style="width: 100%; border:none">
          <img src=${product.image} style="border-radius:0; max-height:450px" alt="...">
          <div class="card-body text-start" >
          <div class="row" >
              <div class="col">
                  <h5 class="card-title">${product.title}</h5>
                  <p class="card-text">${product.weight}kg dresses weight</p>
                  <p class="card-text" style="font-weight: bold; font-size: 17px;">GHC70</p>
               
              </div>
              <div class="col">
                  <a href="#" class="btn btn-success btn-lg" id="add-to-cart-btn-other-products" style="width: 150px;">Buy</a>
              </div>
          </div>
          <br>
      
          </div>
       
 </div>
 <hr>`;
};

filteredProducts.forEach((product) => {
  moreProductsRow.innerHTML += moreProductCard(product);
});

//Handle Add To Cart
function addToCart(product) {
  let isInCart = false;
  if (cart.length > 0) {
    for (let index = 0; index < cart.length; index++) {
      //console.log(cart[index].id == product.id);
      if (cart[index].id == product.id) {
        isInCart = true;
        alert("Product already in cart", "warning");

        break;
      } else {
        isInCart = false;
      }
    }

    if (!isInCart) {
      createOrder(product);
    }
  } else {
    createOrder(product);
  }
}

function removeFromCart(product) {
  cart = cart.filter((prod) => product.id !== prod.id);
  orderQuantity.textContent = cart.length;
  getTotalorderValue();
  myCart.removeChild(document.getElementById(product.id.toString()));
  saveItem('cart', cart);
}

function createOrder(product) {
  cart.push(product);
  myCart.append(loadCartItems(product));
  setCartItemProps(product);
  orderQuantity.textContent = cart.length;
  getTotalorderValue();
  alert("Product added to cart", "success");
  saveItem('cart', cart);
}

function setCartItemProps(product){
   const removeFromCartBtn = document.getElementById(
    product.id.toString() + "remove"
  );
  const addFromCartBtn = document.getElementById(product.id.toString() + "add");
  const decreaseFromCartBtn = document.getElementById(
    product.id.toString() + "decrease"
  );

  removeFromCartBtn.addEventListener("click", () => {
    removeFromCart(product);
  });

  addFromCartBtn.addEventListener("click", () => {
    incrementOrderItem(product, addFromCartBtn);
  });

  decreaseFromCartBtn.addEventListener("click", () => {
    decreamentOrderItem(product, decreaseFromCartBtn);
  });
}

//ADD ADD_TO_CART FUNCTIONALITY TO CARD BUTTONS
//HERO PRODUCTS BUTTONS
let addToCartButtons = document.querySelectorAll("#add-to-cart-btn");
addToCartButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    addToCart(products[selectedProductIndex]);
  });
});

//ALL PRODUCTS BUTTONS
let addToCartButtonsForOtherProducts = document.querySelectorAll(
  "#add-to-cart-btn-other-products"
);
addToCartButtonsForOtherProducts.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    addToCart(products[index]);
  });
});

//Increment Item
function incrementOrderItem(product, el) {
  const quantityEl =
    el.parentElement.parentElement.querySelector("#item-quantity");

  cart.forEach((prod, index) => {
    if (prod.id === product.id) {
      const increament = cart[index].quantity;
      quantityEl.textContent = `x ${increament + 1}`;
      cart[index].quantity += 1;
    }
  });

  saveItem('cart', cart);
  getTotalorderValue();
}

function decreamentOrderItem(product, el) {
  const quantityEl =
    el.parentElement.parentElement.querySelector("#item-quantity");

  cart.forEach((prod, index) => {
    if (prod.id === product.id) {
      if (cart[index].quantity > 0) {
        const decrease = cart[index].quantity;
        quantityEl.textContent = `x ${decrease - 1}`;
        cart[index].quantity -= 1;
      } else {
        removeFromCart(product);
      }
    }
  });

  saveItem('cart', cart);
  getTotalorderValue();
}

function getTotalorderValue() {
  let totalValue = 0;
  cart.forEach((item) => {
    totalValue += item.price * item.quantity;
  });
  const totalOrderValue = document.getElementById("total-order-value");
  totalOrderValue.textContent = `Total: GHC${totalValue}`;
}

//Add to cart alerts
const alertPlaceholder = document.getElementById("liveAlertPlaceholder");

const alert = (message, type) => {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible fade show d-flex align-items-center" role="alert">`,
    `${
      type == "success"
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bag" viewBox="0 0 16 16">
    <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
  </svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
</svg>`
    }`,
    `<div style="margin-left:3px">${message}</div>`,

    "</div>",
  ].join("");

  alertPlaceholder.append(wrapper);
  window.setTimeout(() => {
    alertPlaceholder.removeChild(wrapper);
  }, 1500);
};

//Handle CartItems
function loadCartItems(item) {
  const cartItemDiv = document.createElement("div");
  cartItemDiv.setAttribute("id", item.id.toString());
  cartItemDiv.innerHTML = [
    `<div class="row">
    <div class="col">
      <img src=${item.image} width="50", height="50">
    </div>
     <div class="col-7">
      <h4>${item.title}</h4>
      <span>GHC${
        item.price
      } <span id='item-quantity' style="color:grey; font-weight:normal">x ${
      item.quantity
    }</span></span>

      <div class="row">
          <div class="col btn" id=${
            item.id.toString() + "add"
          }><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg></div>
          <div class="col"></div>
          <div class="col btn" id=${
            item.id.toString() + "decrease"
          }><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-lg" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z"/>
            </svg></div>
      </div>
     </div>
     <div class="col btn" id=${item.id.toString() + "remove"}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
        </svg>
     </div>
    </div>`,
  ];
  return cartItemDiv;
}

//HANDLE CATEGORIES DISPLAY
const categoriesContainer = document.getElementById("categories");
function loadCategories(category, index) {
  const id = `${category.category}-${index}`;
  return `<div  class="btn text-center mx-2"  height="100px" id="filters">
      <img src=${category.image} height="80" width="80" style="border-radius:10px">
      <p style="font-size: 17px" class="my-2">${category.category}</p>
    </div>`;
}

// HANDLE ORDER PLACING

//COLLECT USER INFORMATION
const userForm = document.getElementById("contact-details");
const orderBtn = document.getElementById("place-order");
const saveDetailsBtn = document.getElementById("save-details");


orderBtn.addEventListener("click", async () => {
  if (userDetails) {
    orderBtn.innerHTML = `<span class="spinner-grow spinner-grow-sm" id="place-order-spinner" role="status" aria-hidden="true"></span> Placing order`;
    await  placeProcessOrder();
    orderBtn.innerHTML = `Place Order`;
    $("#cartModal").modal("hide");
    return;
  }
  $("#cartModal").modal("hide");
  userForm.classList.remove("hide");
});

saveDetailsBtn.addEventListener("click", () => {
  //userForm.classList.add("hide");
  const userName = document.querySelector("#username");
  const phone = document.querySelector("#phone");
  saveUserDetails(userName.value, phone.value);
});

function saveUserDetails(name, phone) {
  userDetails = {
    name: name,
    phone: phone,
  };
  saveItem('userDetails', userDetails);
  placeProcessOrder();
}

async function placeProcessOrder() {
  if(cart.length > 0){
    const myCart = [];
    cart.forEach((product) => {
      myCart.push({
        title: product.title,
        image: product.image,
        price: product.price,
        state: product.state,
        category: product.category,
        quantity: product.quantity,
        id: product.id,
      });
    });
    const jCart = JSON.stringify(myCart);
    const order = new Orders(jCart, userDetails);
    orderSpinnerFuntionality();
    const orderPlaced = await uploadOrder(order.toJSON(), userDetails);
    if(orderPlaced.status == true){
      orderLink = orderPlaced.link;
      userForm.classList.add("hide");
      orderPlacedCtn.classList.remove("hide");
      clearCart();
      // alert('Your order has been placed', 'success');
    }
    return true;
  }

  alert('Please buy an item, to check out.', 'warning');
  userForm.classList.add("hide");

  return true;
}

function clearCart(){
  cart.forEach(product =>{
    myCart.removeChild(document.getElementById(product.id.toString()));
  });
  cart = [];
  removeItem('cart');
  orderQuantity.textContent = cart.length;
  getTotalorderValue();
  
}

function orderSpinnerFuntionality(){
  saveDetailsBtn.innerHTML = `<span class="spinner-grow spinner-grow-sm" id="place-order-spinner" role="status" aria-hidden="true"></span> Placing order`;
}

//HANDLE WHATSAPP CHAT
function whatsaapOrder(phone, order_url, text) {
  window.location.href =
    "https://wa.me/" +
    phone +
    text +
    order_url;
}

async function shareProducts() {
  const shareData = {
    title: "Visit farmshop.com",
    text: "Shop for fresh farm products in tarkwa on farmshop.com; we sell poultary products, pork and catfish",
  };
  await window.navigator.share(shareData);
}

function makeCall(phone) {
  window.location.href = "tel:" + phone + "?call";
}

const contactBtn = document.getElementById("contact");
const whatsappBtn = document.getElementById("whatsaap");
const shareBtn = document.getElementById("share");

contactBtn.addEventListener("click", () => {
  makeCall("+233597971286");
});

whatsappBtn.addEventListener("click", () => {
  whatsaapOrder("+2330591971286", "www.whatsapp.com", "?text=I%20placed%20an%20order%20for%20some%20products.");
});

shareBtn.addEventListener("click", () => {
  shareProducts();
});


categories.forEach((category, index) => {
  categoriesContainer.innerHTML += loadCategories(category, index);
});

const categoryItems = document.querySelectorAll("#filters");
categoryItems.forEach((category, index) => {
  category.addEventListener("click", () => {
    category.classList.add("btn-warning");
    filterProductsByCategory(categories[index].category, index);
  });
});

function filterProductsByCategory(category, indexz) {
  filteredProducts = products.filter((product) => product.category == category);
  moreProductsRow.innerHTML = "";
  filteredProducts.forEach((product) => {
    moreProductsRow.innerHTML += moreProductCard(product);
  });

  const categoryItems = document.querySelectorAll("#filters");
  categoryItems.forEach((category, index) => {
    if (indexz != index) {
      category.classList.remove("btn-warning");
    }
  });
}



notifyUsBtn.addEventListener('click', () =>{
  whatsaapOrder("+233591971286", orderLink, "?text=Hello%20FarmShop,%20please%20process%20my%20order%20quickly."+"%20*Order%20link*%20");
   orderPlacedCtn.classList.add('hide');
});

orderPlacedCtnClose.addEventListener("click",()=>{
  orderPlacedCtn.classList.add('hide');
});

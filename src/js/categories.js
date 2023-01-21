import  {Product, products, cart, User, Orders, categories} from "./mocked_data.js";


let addToCartButtonsForOtherProducts = document.querySelectorAll("#add-to-cart-btn-other-products");
addToCartButtonsForOtherProducts.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    addToCart(products[index]);
  });
});

var urlparams = (function(){
  function getUrlParam(param){
    const url = new URL(window.location.href);
    return url.searchParams.get(param);
  }
});
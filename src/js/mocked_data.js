//Products model
class Product {
  constructor(
    title,
    image,
    description,
    state,
    weight,
    price,
    category,
    id,
    quantity = 1,
    stock = 10
  ) {
    this.title = title;
    this.image = image;
    this.description = description;
    this.weight = weight;
    this.price = price;
    this.state = state;
    this.category = category;
    this.quantity = quantity;
    this.stock = stock;
    this.id = id;
  }
}


class Category{
  constructor(category, image, selected){
    this.category = category;
    this.image = image;
    this.selected = selected;
  }
}


class User{
    constructor(name, phone){
        this.name = name;
        this.phone = phone;
    }
}

class Orders{
    constructor(cart, owner){
             this.cart = cart;
             this.owner = owner;
             this.orderDate = Date().toString();
             this.id = `${owner.name}-${owner.phone}-${this.date}`;

    }

    toJSON(){
      return {
        cart: this.cart,
        owner: {
          name: this.owner.name,
          phone: this.owner.phone
        },
        orderDate: this.orderDate,
        id: this.id
      };
    }
}

//Cart Items
let cart = [];

// List of broducts from DB
let products = [
  new Product(
    "Life Chicken",
    "./assets/life_chicken_01.jpg",
    "life chicken",
    "life bird",
    "30",
    "70",
    "",
    1
  ),
  new Product(
    "Dressed Chicken",
    "./assets/life_chicken_02.jpg",
    "life chicken",
    "dressed",
    "40",
    "50",
    "Eggs",
    2
  ),

  new Product(
    "bbeef",
    "./assets/life_chicken_01.jpg",
    "life chicken",
    "life bird",
    "30",
    "70",
    "Catfish",
    3
  ),
  new Product(
    "Dressed Chicken",
    "./assets/life_chicken_02.jpg",
    "life chicken",
    "dressed",
    "40",
    "50",
    "Poultary",
    4
  ),
];

let filteredProducts = products;


const categories = [
  new Category("Poultary", "./assets/life_chicken_01.jpg", false),
  new Category("Catfish", "./assets/life_chicken_01.jpg", false),
  new Category("Pork", "./assets/life_chicken_02.jpg", false),
  new Category("Mushrooms", "./assets/life_chicken_01.jpg", false),
  new Category("Eggs", "./assets/life_chicken_02.jpg", false),
];

module.exports = {Product, products, filteredProducts, cart, User, Orders, categories};

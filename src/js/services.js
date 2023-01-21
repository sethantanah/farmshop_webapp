import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc} from 'firebase/firestore/lite';
import {
    Product,
    products,
    filteredProducts,
    cart,
    User,
    Orders,
    categories,
} from "./mocked_data.js";


const firebaseConfig = {
    apiKey: "AIzaSyAFD0YzFt1UAyXCCw7-E2FFv1H0SqjthNE",
    authDomain: "farmstore-4da11.firebaseapp.com",
    projectId: "farmstore-4da11",
    storageBucket: "farmstore-4da11.appspot.com",
    messagingSenderId: "696368105263",
    appId: "1:696368105263:web:6b22b885c114ff2599c3da",
    measurementId: "G-HMXS6JY4V0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// Firestore data converter
var productConverter = {
    toFirestore: function (product) {
        return {
            title: product.title,
            image: product.image,
            description: product.description,
            weight: product.weight,
            price: product.price,
            state: product.state,
            category: product.category,
            quantity: product.quantity,
            stock: product.stock,
            id: product.id,
        };
    },

    fromFirestore: function (snapshot, options) {
        const data = snapshot.data(options);
        return new Product(data.title, data.image, data.description, data.weight, data.price, data.state, data.category,
            data.quantity, data.stock, data.id);
    }
};


async function uploadOrder(order, user){
    try {
         if(user.id){
            const userRef = await addDoc(collection(db, "users"), user);
            userDetails = {
                name: user.name,
                phone: user.phone,
                id: userRef.id
              };
              saveItem('userDetails', userDetails);
         }
        
         const orderRef =  await addDoc(collection(db, "orders"), order);
        
        return {
            status: true,
            link: orderRef.id,
        };
      } catch (e) {
         //console.error("Error adding document: ", e);
         return {
            status: false,
            link: '',
        };
      }

     
}

async function saveOrder(order){
    try {
        const docRef = await addDoc(collection(db, "orders"), order);
      } catch (e) {
        // console.error("Error adding document: ", e);
      }

      return true;
}



export default uploadOrder;



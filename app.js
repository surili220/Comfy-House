
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document .querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");



//getting products
class Products{

    async getProducts()
    {
        try {
             let result = await fetch('products.json')
            let data = await result.json();
            let products = data.items;
            //extracting the data from json
            products= products.map(item => {

                const{title,price}=item.fields;
                const{id}=item.sys;
                const{image}=item.fields.image.fields.file.url;
                return {title, price, id, image}

            })

             return products;

        } catch (error) {
            console.log(error);
        }
        
    }

}
//displaying the products
class UI{

}

//local storage
class  Storage{

}
//DOMCOntentLoader- It is an event that fires when the inital html has been loaded without any stylesheets, images finish toload.
document.addEventListener("DOMContentLoaded", () => {
const ui = new UI();
const prod = new Products();

//getting the products
prod.getProducts().then(data => console.log(data));

})
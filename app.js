
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document .querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

//cart items
let cart =[];
//buttons
let buttonsDOM = [];

//getting products
class Products{

    async getProducts()
    {
        try {
             let result = await fetch('products.json')
            let data = await result.json();
            let products = data.items;
            //extracting the data from json

            products = products.map(item => {
                const { title, price } = item.fields;
                const { id } = item.sys;
                const image = item.fields.image.fields.file.url;
                return { title, price, id, image };
              });
        
          

             return products;   

        } catch (error) {
            console.log(error);
        }
        
    }

}
//displaying the products
class UI
{
    displayProducts(products) {
        let result = "";
        products.forEach(product => {
          result += `
       <!-- single product -->
            <article class="product">
              <div class="img-container">
                <img
                  src=${product.image}
                  alt="product"
                  class="product-img"
                />
                <button class="bag-btn" data-id=${product.id}>
                  <i class="fas fa-shopping-cart"></i>
                  add to bag
                </button>
              </div>
              <h3>${product.title}</h3>
              <h4>$${product.price}</h4>
            </article>
            <!-- end of single product -->
       `;
        });
        productsDOM.innerHTML = result;
      }
    //getting all the buttons
    //you will get them in node list ...hence converting them into an array.
    
      // if the item is added in the  cart, we check with the id., if its present in the cart array or not.
    //if the item is in the cart we need to disable the button to add the item.

    
    getBagButtons()
    {
        //used the spread operator to convert the node list into array.
        const buttons = [...document.querySelectorAll(".bag-btn")];
        buttonsDOM = buttons;
        buttons.forEach(button =>{
         
            let id = button.dataset.id; 
            let inCart = cart.find(item => item.id === id);
            if(inCart)
            {
                button.innerText = "in cart";
                button.disabled = true;
            }
                button.addEventListener('click', (event)=>{
                event.target.innerText ="In Cart";
                event.target.disabled = true;
                //get product from products
                let cartItem = {...Storage.getProduct(id), amount : 1};
                
                //add product to the cart
                //here we are also adding the items already present in the cart and the new items
                cart =[...cart, cartItem];
                //save the cart in local storage
                Storage.saveCart(cart);
                //set the values
                this.setCartValues(cart);
                //display cart items
                this.addCartItem(cartItem);
                //show the cart
        
              }); 
    
        });
    
    }  
    
    
    setCartValues(cart)
    {
        let tempTotal =0;
        let itemsTotal =0;

        cart.map(item =>{
          tempTotal += item.price * item.amount;
          itemsTotal += item.amount;  
        })

        cartTotal.innerText =parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }
    
    addCartItem(item)
    {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        
       div.innerHTML = ` <img src="${item.image}" alt="product">
        <div>
            <h4>${item.title}</h4>
            <h5>${item.price}</h5>
            <span class="remove-item"  data-id= ${item.id}>remove</span>
        </div>
        <div>
            <i class="fas fa-chevron-up" data-id= ${item.id}></i>
            <p class="item-amount">${item.amount}</p>
            <i class="fas fa-chevron-down" data-id= ${item.id}></i>
        </div>` ;

        cartContent.appendChild(div);
    }

    

 

}
//local storage
class  Storage{
  //saving all the data locally on local storage. the setOtem method accepts key value pairs. Key here is products and value is the
  //JSON array that we need to convert into string and store it as a value,
  static saveProducts(products)
  {
    localStorage.setItem("products", JSON.stringify(products));

  }
  static getProduct(id){
   //getting all the products from the local storage 
    let products = JSON.parse(localStorage.getItem('products'));
   //finding the product in the array with the id that is passed from the fuction.
    return products.find(product => product.id === id);
  }
  
  static saveCart(cart)
  {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

}
//DOMCOntentLoader- It is an event that fires when the inital html has been loaded without any stylesheets, images finish toload.
document.addEventListener("DOMContentLoaded", () => {
const ui = new UI();
const prod = new Products();

//getting the products
prod.getProducts().then(products => {
  ui.displayProducts(products)
Storage.saveProducts(products)
}).then(() => {

  ui.getBagButtons();  
});

});
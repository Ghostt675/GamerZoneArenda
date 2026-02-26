let cart=[];

function toggleCatalog(){
  document.getElementById("sidebar").classList.toggle("open");
}

function addToCart(name,price){
  cart.push({name,price});
  updateCart();
}

function updateCart(){
  document.getElementById("cartCount").innerText=cart.length;
}

function openCart(){
  let modal=document.getElementById("cartModal");
  let items=document.getElementById("cartItems");

  items.innerHTML="";
  let total=0;

  cart.forEach(i=>{
    items.innerHTML+=`<p>${i.name} — ${i.price} ₽</p>`;
    total+=i.price;
  });

  document.getElementById("total").innerText=
    "Итого: "+total+" ₽";

  modal.style.display="block";
}

document.addEventListener("DOMContentLoaded", function () {
  fetch("data/products.xml")
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, "application/xml");
      const products = xml.getElementsByTagName("product");

      let output = "";
      for (let product of products) {
        const name = product.getElementsByTagName("name")[0].textContent;
        const safeName = name.replace(/'/g, "\\'").replace(/"/g, '\\"');
        const price = product.getElementsByTagName("price")[0].textContent;
        const image = product.getElementsByTagName("image")[0].textContent;

        output += `
          <div class="product">
            <img src="${image}" alt="${safeName}" width="150">
            <h3>${name}</h3>
            <p>Price: R${price}</p>
            <button onclick="addToCart('${safeName}', ${price})">Add to Cart</button>
          </div>`;
      }

      const list = document.getElementById("product-list");
      if (list) {
        list.innerHTML = output;
      } else {
        console.error("product-list container not found");
      }
    })
    .catch(error => {
      console.error("Fetch error:", error);
    });
});

function addToCart(name, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ name, price });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${name} added to cart`);
}

function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1); // Remove the item at the specified index
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart(); // Update cart display
}

function clearCart() {
  localStorage.removeItem("cart"); // Clear all items from the cart
  displayCart(); // Update cart display
}

function displayCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartList = document.getElementById("cart-list");
  const totalPriceElement = document.getElementById("total-price");
  
  cartList.innerHTML = ""; // Clear previous cart items
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price; // Accumulate the total price
    cartList.innerHTML += `
      <div>
        <span>${item.name} - R${item.price.toFixed(2)}</span>
        <button onclick="removeFromCart(${index})">Remove</button>
      </div>`;
  });

  // Show total price
  totalPriceElement.innerText = `Total Price: R${total.toFixed(2)}`;
}

// Clear cart button
document.getElementById("clear-cart").addEventListener("click", clearCart);
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
        const safeName = name.replace(/'/g, "\'").replace(/"/g, '\"');
        const price = parseFloat(product.getElementsByTagName("price")[0].textContent);
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

      const cartContainer = document.getElementById("cart-items");
      if (cartContainer) {
        displayCart();
        const clearBtn = document.getElementById("clear-cart");
        if (clearBtn) {
          clearBtn.addEventListener("click", clearCart);
        }
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
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

function clearCart() {
  localStorage.removeItem("cart");
  displayCart();
}

function displayCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartContainer = document.getElementById("cart-items");

  let html = "<h2>Your Cart</h2>";
  let total = 0;

  if (cart.length === 0) {
    html += "<p>Your cart is empty.</p>";
  } else {
    cart.forEach((item, index) => {
      const price = parseFloat(item.price);
      html += `<p>${item.name} - R${price.toFixed(2)} <button onclick="removeFromCart(${index})">Remove</button></p>`;
      total += price;
    });
    html += `<h3>Total: R${total.toFixed(2)}</h3>`;
  }

  html += '<button id="clear-cart">Clear Cart</button>';
  cartContainer.innerHTML = html;
  document.getElementById("clear-cart").addEventListener("click", clearCart);
}
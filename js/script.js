document.addEventListener("DOMContentLoaded", function () {
  // Load products from XML
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
      }
    })
    .catch(error => {
      console.error("Fetch error:", error);
    });

  // ✅ Attach the Clear Cart Button event *AFTER* the DOM is fully ready
  const clearCartBtn = document.getElementById("clear-cart");
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", clearCart);
  }
});

const productDataUrl = 'https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json';
async function fetchProductData() {
  try {
    const response = await fetch(productDataUrl);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.categories)) {
      throw new Error('Invalid data format. "categories" property not found.');
    }

    return data.categories;
  } catch (error) {
    console.error('Error fetching product data:', error.message);
    return [];
  }
}

async function renderProducts(category) {
  const productContainer = document.getElementById('productCardContainer');

  if (!productContainer) {
    console.error('Product container not found');
    return;
  }

  productContainer.innerHTML = '';

  const categories = await fetchProductData();

  const selectedCategory = categories.find(cat => cat.category_name.toLowerCase() === category.toLowerCase());

  if (!selectedCategory || !Array.isArray(selectedCategory.category_products)) {
    console.warn(`No products found for category: ${category}`);
    return;
  }

  selectedCategory.category_products.forEach(product => {
    const discountPercentage = Math.round(((parseInt(product.compare_at_price) - parseInt(product.price)) / parseInt(product.compare_at_price)) * 100);

    const productCard = document.createElement('div');
    productCard.className = 'product-card-item';

    productCard.innerHTML = `
      <img class="product-image" src="${product.image}" alt="${product.title}">
      <div class="product-details">
        <div class="badge">${product.badge_text || ''}</div>
        <h3>${product.title}</h3>
        <p>Vendor: ${product.vendor}</p>
        <p>Price: $${product.price}</p>
        <p>Compare at Price: $${product.compare_at_price}</p>
        <p>${discountPercentage}% off</p>
        <button class="add-to-cart-button">Add to Cart</button>
      </div>
    `;

    productContainer.appendChild(productCard);
  });
}

function filterProducts(category) {
  renderProducts(category);
}

// Initial render
renderProducts('Men');

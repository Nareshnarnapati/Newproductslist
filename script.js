document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    const listViewButton = document.getElementById('list-view');
    const gridViewButton = document.getElementById('grid-view');
    const productContainer = document.getElementById('product-container');

    let productList = [];

    async function fetchData() {
        try {
            const response = await fetch('https://mocki.io/v1/0934df88-6bf7-41fd-9e59-4fb7b8758093');
            const data = await response.json();
    
            // Log the entire API response
            console.log('API Response:', data);
    
            // Check if 'data' contains a property with the 'products' array
            const products = data && (data.products || data.data?.products);
    
            if (!products || !Array.isArray(products)) {
                console.error('Invalid data structure in API response');
                return;
            }
    
            productList = products;
            renderProducts(productList);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    

    async function fetchData() {
        try {
            const response = await fetch('https://mocki.io/v1/0934df88-6bf7-41fd-9e59-4fb7b8758093');
            const data = await response.json();
    
            // Log the entire API response for debugging
            console.log('API Response:', data);
    
            // Check if 'data' contains a property with the 'products' array
            const products = data && (data.products || data.data?.products);
    
            if (!products || !Array.isArray(products)) {
                // If 'products' is still not valid, try to directly use 'data' as products
                if (Array.isArray(data)) {
                    console.warn('Using data directly as products:', data);
                    productList = data;
                } else {
                    console.error('Invalid data structure in API response');
                    return;
                }
            } else {
                productList = products;
            }
    
            renderProducts(productList);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    
    function createProductCard(product) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>${product.vendor}</p>
            <p>Price: $${product.price}</p>
            <p>Compare at Price: $${product.compareAtPrice}</p>
            <p>Discount: ${calculateDiscount(product.price, product.compareAtPrice)}%</p>
            <button>Add to Cart</button>
        `;
        return card;
    }

    function calculateDiscount(price, compareAtPrice) {
        const discount = ((compareAtPrice - price) / compareAtPrice) * 100;
        return discount.toFixed(2);
    }

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = productList.filter(product =>
            product.variants.some(variant => variant.toLowerCase().includes(searchTerm))
        );
        renderProducts(filteredProducts);
    });

    listViewButton.addEventListener('click', () => {
        console.log('Switching to List View');
        productContainer.classList.remove('grid-view');
        productContainer.classList.add('list-view');
        renderProducts(productList); // Render products after changing the view
    });

    gridViewButton.addEventListener('click', () => {
        console.log('Switching to Grid View');
        productContainer.classList.remove('list-view');
        productContainer.classList.add('grid-view');
        renderProducts(productList); // Render products after changing the view
    });

    fetchData();
});

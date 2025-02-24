const request = indexedDB.open('ViewPointDB', 1);

let db;

const initialProducts = [
  {
    name: '43" Телевизор Hyundai H-LED43BU7006, 4K Ultra HD, черный, СМАРТ ТВ, Android TV',
    description: 'Экран: 3840 x 2160, LED, 4K Ultra HD \nЧастота обновления: 60 Гц \nДиагональ: 43" \nОсобенности: SMART TV; HDR',
    price: 25990,
  },
  {
    name: '50" Телевизор Samsung QE50Q60DAUXRU, QLED, 4K Ultra HD, серый, СМАРТ ТВ, Tizen OS',
    description: 'Экран: 3840 x 2160, QLED, 4K Ultra HD \nЧастота обновления: 60 Гц \nДиагональ: 50" \nОсобенности: SMART TV; HDR',
    price: 72590,
  },
  {
    name: '43" Телевизор SunWind SUN-LED43XU400, 4K Ultra HD, черный, СМАРТ ТВ, YaOS',
    description: 'Экран: 3840 x 2160, LED, 4K Ultra HD \nЧастота обновления: 60 Гц \nДиагональ: 43" \nОсобенности: SMART TV',
    price: 22190,
  },
  {
    name: '50" Телевизор Hisense 50E7NQ, QLED, 4K Ultra HD, черный, СМАРТ ТВ, Vidaa',
    description: 'Экран: 3840 x 2160, QLED, 4K Ultra HD \nЧастота обновления: 60 Гц \nДиагональ: 50" \nОсобенности: SMART TV; HDR',
    price: 44990,
  },
  {
    name: '32" Телевизор Digma DM-LED32SBB33, FULL HD, черный, СМАРТ ТВ, YaOS',
    description: 'Экран: 1920 x 1080, LED, FULL HD \nЧастота обновления: 60 Гц \nДиагональ: 32" \nОсобенности: SMART TV; HDR',
    price: 14890,
  },
  {
    name: '43" Телевизор Xiaomi MI TV A 43 FHD 2025, FULL HD, черный, СМАРТ ТВ, Android',
    description: 'Экран: 1920 x 1080, LED, FULL HD \nЧастота обновления: 60 Гц \nДиагональ: 43" \nОсобенности: SMART TV',
    price: 24990,
  },
  {
    name: '32" Телевизор StarWind SW-LED32BG200, HD, черный',
    description: 'Экран: 1366 x 768, LED, HD \nЧастота обновления: 60 Гц \nДиагональ: 32" ',
    price: 11990,
  },
  {
    name: '86" Телевизор LG 86UR78006LB.ARUG, 4K Ultra HD, черный, СМАРТ ТВ, WebOS',
    description: 'Экран: 3840 x 2160, LED, 4K Ultra HD \nЧастота обновления: 50 Гц \nДиагональ: 86" \nОсобенности: SMART TV; HDR',
    price: 174270,
  },
  {
    name: '65" Телевизор LG 65UR81006LJ.ARUB, 4K Ultra HD, черный, СМАРТ ТВ, WebOS',
    description: 'Экран: 3840 x 2160, LED, 4K Ultra HD \nЧастота обновления: 50 Гц \nДиагональ: 65" \nОсобенности: SMART TV; HDR',
    price: 93500,
  },
  {
    name: '32" Телевизор Xiaomi MI TV A 32 2025, HD, черный, СМАРТ ТВ, Android',
    description: 'Экран: 1366 x 768, LED, HD \nЧастота обновления: 60 Гц \nДиагональ: 32" \nОсобенности: SMART TV',
    price: 16990,
  }
];

request.onupgradeneeded = function(event) {
  db = event.target.result;

  if (!db.objectStoreNames.contains('products')) {
    const productStore = db.createObjectStore('products', {
      keyPath: 'id',
      autoIncrement: true,
    });
    productStore.createIndex('name', 'name', { unique: false });
    productStore.createIndex('description', 'description', { unique: false });
    productStore.createIndex('price', 'price', { unique: false });

    initialProducts.forEach(product => {
      productStore.add(product);
    });
  }

  if (!db.objectStoreNames.contains('cart')) {
    const cartStore = db.createObjectStore('cart', {
      keyPath: 'id',
      autoIncrement: true,
    });
    cartStore.createIndex('name', 'name', { unique: false });
    cartStore.createIndex('price', 'price', { unique: false });
  }
};

request.onsuccess = function(event) {
  db = event.target.result;
  console.log('Database opened successfully');
  displayProducts();
};

request.onerror = function(event) {
  console.error('Error opening database:', event.target.error);
};

function addProduct(product) {
  if (!db) {
    console.error('Database not initialized');
    return;
  }

  const transaction = db.transaction('products', 'readwrite');
  const store = transaction.objectStore('products');
  const request = store.add(product);

  request.onsuccess = function() {
    console.log('Product added:', product);
  };

  request.onerror = function(event) {
    console.error('Error adding product:', event.target.error);
  };
}

function displayProducts() {
  if (!db) {
    console.error('Database not initialized');
    return;
  }

  const transaction = db.transaction('products', 'readonly');
  const store = transaction.objectStore('products');
  const request = store.getAll();

  request.onsuccess = function() {
    const products = request.result;
    const productList = document.getElementById('product-list');
    
    if (productList) {
      productList.innerHTML = ''; // Clear the list

      products.forEach((product) => {
        const productItem = document.createElement('button');
        productItem.className = 'product rounded';
        productItem.setAttribute(
          'onclick',
          "location.href='product.html?productId=" + product.id + "'"
        );
        productItem.innerHTML = `
          <img src="images/${product.id}.webp" class="d-block" alt="...">
          <p class="tv-name">${product.name}</p>
          <p class="tv-price">${product.price} \u20bd</p>
        `;
        productList.appendChild(productItem);
      });
    }

    const productCarousel = document.getElementsByClassName('carousel-item-list');

    if (productCarousel.length > 0) {
      const maxCarouselItems = 5;

      for (let j = 0; j < 2; j++) {
        productCarousel[j].innerHTML = '';
        for (let i = 0; i < maxCarouselItems; i++) {
          const product = products[9 - i];
          if (product) {
            const productItemCarousel = document.createElement('li');
            productItemCarousel.className = 'product rounded';
            productItemCarousel.innerHTML = `
              <button class="rounded" onclick="location.href='product.html?productId=${product.id}'">
                <img src="images/${product.id}.webp" class="d-block" alt="...">
                <p class="tv-name">${product.name}</p>
                <p class="tv-price">${product.price} \u20bd</p>
              </button>
            `;
            productCarousel[j].appendChild(productItemCarousel);
          }
        }
      }
    }
  };

  request.onerror = function(event) {
    console.error('Error fetching products:', event.target.error);
  };
}
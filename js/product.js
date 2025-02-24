const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get("productId"));

const request = indexedDB.open("ViewPointDB", 1);

request.onsuccess = function (event) {
    const db = event.target.result;

    const transaction = db.transaction("products", "readonly");
    const store = transaction.objectStore("products");
    const getRequest = store.get(productId);

    getRequest.onsuccess = function () {
        const product = getRequest.result;

        if (product) {
            document.getElementById('tv-image').setAttribute("src", "images/" + product.id + ".webp");
            document.getElementById('tv-name').textContent = product.name;
            
            const descriptionLines = product.description.split('\n');
            const formattedDescription = descriptionLines.map(line => {
                const [key, value] = line.split(': ');
                return `<div class="info-row">
                    <span class="info-label">${key}:</span>
                    <span class="info-value">${value}</span>
                </div>`;
            }).join('');

            document.getElementById('product-info').innerHTML = formattedDescription;
            document.getElementById('price').textContent = `Цена: ${product.price} \u20bd`;

            document.getElementById("add-to-cart").addEventListener("click", () => {
                addToCart(product);
            });
        } else {
            document.getElementById("product-info").innerHTML = "<p>Продукт не найден.</p>";
        }
    };

    getRequest.onerror = function (event) {
        console.error("Error fetching product:", event.target.error);
    };
};

request.onerror = function (event) {
    console.error("Error opening database:", event.target.error);
};

function addToCart(product) {
    const request = indexedDB.open("ViewPointDB", 1);

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction("cart", "readwrite");
        const store = transaction.objectStore("cart");

        const checkRequest = store.index("name").get(product.name);
        
        checkRequest.onsuccess = function () {
            const existingProduct = checkRequest.result;
        
            if (existingProduct) {
                alert("Данный товар уже есть в корзине!");
            } else {
                const addRequest = store.add(product);
            
                addRequest.onsuccess = function () {
                    alert("Товар добавлен в корзину!");
                };
            
                addRequest.onerror = function (event) {
                    console.error("Error adding product to cart:", event.target.error);
                };
            }
        };
        
        checkRequest.onerror = function (event) {
            console.error("Error checking cart:", event.target.error);
        };
    };

    request.onerror = function (event) {
        console.error("Error opening database:", event.target.error);
    };
}

const request = indexedDB.open("ViewPointDB", 1);

request.onsuccess = function (event) {
    const db = event.target.result;

    // Fetch cart items
    const transaction = db.transaction("cart", "readonly");
    const store = transaction.objectStore("cart");
    const getRequest = store.getAll();

    getRequest.onsuccess = function () {
        const cartItems = getRequest.result;
        const cartItemsContainer = document.getElementById("cart-items");

        cartItemsContainer.innerHTML = ""; // Clear the container

        let totalPrice = 0;

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = "<p>Ваша корзина пуста.</p>";
        } else {
            cartItems.forEach((item) => {
                const cartItem = document.createElement("div");
                cartItem.className = "cart-item";
                cartItem.innerHTML = `
                <h4 class="tv-name">${item.name}</h4>
                <p>Цена: ${item.price} \u20bd</p>
                <button class="btn btn-danger" onclick="removeFromCart(${item.id})">Убрать из корзины</button>
                `;
                totalPrice += item.price;
                cartItemsContainer.appendChild(cartItem);
            });
        }
        document.getElementById("cart-total").innerText = "Всего: " + totalPrice + " \u20bd";
    };

    getRequest.onerror = function (event) {
        console.error("Error fetching cart items:", event.target.error);
    };
};

request.onerror = function (event) {
    console.error("Error opening database:", event.target.error);
};

// Function to remove an item from the cart
function removeFromCart(id) {
    const request = indexedDB.open("ViewPointDB", 1);

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction("cart", "readwrite");
        const store = transaction.objectStore("cart");
        const deleteRequest = store.delete(id);

        deleteRequest.onsuccess = function () {
            alert("Товар убран из корзины.");
            window.location.reload(); // Refresh the page to update the cart
        };

        deleteRequest.onerror = function (event) {
            console.error("Error removing item from cart:", event.target.error);
        };
    };

    request.onerror = function (event) {
        console.error("Error opening database:", event.target.error);
    };
}

// Form validation and submission
document.getElementById("checkout-form").addEventListener("submit", function(event) {
    event.preventDefault();
    
    if (!this.checkValidity()) {
        event.stopPropagation();
        this.classList.add('was-validated');
        return;
    }

    const email = document.getElementById("email").value;
    const paymentMethod = document.getElementById("payment-method").value;

    alert("Ошибка! \nВ данный момент невозможно провести оплату");
});
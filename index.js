
const STORE = {
    name: "AVON Perfume Store",

    
    whatsapp: "+260976072217",

    currency: "ZMW"
};

const products = [

    {
        id: 1,
        name: "Avon Far Away",
        category: "women",
        price: 350,
        image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600",
        description: "An elegant fragrance."
    },

    {
        id: 2,
        name: "Avon Little Black Dress",
        category: "women",
        price: 300,
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600",
        description: "A sophisticated fragrance."
    },

    {
        id: 3,
        name: "Avon Attraction",
        category: "men",
        price: 400,
        image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600",
        description: "A confident masculine fragrance."
    },

    {
        id: 4,
        name: "Avon Black Suede",
        category: "men",
        price: 320,
        image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=600",
        description: "A distinctive fragrance."
    },

    {
        id: 5,
        name: "Avon Perceive",
        category: "women",
        price: 280,
        image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600",
        description: "A refreshing everyday fragrance."
    },

    {
        id: 6,
        name: "Avon Individual Blue",
        category: "men",
        price: 290,
        image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600",
        description: "A fresh masculine fragrance."
    }

];

let cart = JSON.parse(localStorage.getItem("avonCart")) || [];

function formatPrice(price) {

    return new Intl.NumberFormat("en-ZM", {

        style: "currency",
        currency: "ZMW",
        maximumFractionDigits: 2

    }).format(price);

}

function displayProducts(productList = products) {

    const productsContainer = document.getElementById("products");

    productsContainer.innerHTML = "";

    if (productList.length === 0) {

        productsContainer.innerHTML =
            `<p class="no-products">No perfumes found.</p>`;

        return;

    }

    productList.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy">

            </div>

            <div class="product-info">

                <p class="product-category">
                    ${product.category}
                </p>

                <h3>${product.name}</h3>

                <p class="product-price">
                    ${formatPrice(product.price)}
                </p>

                <button
                    class="add-cart"
                    data-id="${product.id}">

                    ADD TO CART

                </button>

            </div>

        `;

        productsContainer.appendChild(card);

    });

}

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", filterProducts);


const categoryFilter = document.getElementById("categoryFilter");

categoryFilter.addEventListener("change", filterProducts);


function filterProducts() {

    const searchTerm = searchInput.value.toLowerCase();

    const category = categoryFilter.value;

    const filteredProducts = products.filter(product => {

        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm);

        const matchesCategory =
            category === "all" || product.category === category;

        return matchesSearch && matchesCategory;

    });

    displayProducts(filteredProducts);

}
document.getElementById("products").addEventListener("click", event => {

    const button = event.target.closest(".add-cart");

    if (!button) return;

    const productId = Number(button.dataset.id);

    addToCart(productId);

});


function addToCart(productId) {

    const product = products.find(p => p.id === productId);

    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({

            ...product,
            quantity: 1

        });

    }

    saveCart();

    alert(`${product.name} added to cart!`);

}

function saveCart() {

    localStorage.setItem("avonCart", JSON.stringify(cart));

    updateCart();

}

function updateCart() {

    const cartItems = document.getElementById("cartItems");

    const cartCount = document.getElementById("cartCount");

    const cartTotal = document.getElementById("cartTotal");


    cartItems.innerHTML = "";

    let total = 0;

    let totalQuantity = 0;


    if (cart.length === 0) {

        cartItems.innerHTML =
            `<p class="empty-cart">Your cart is empty.</p>`;

    }


    cart.forEach(item => {

        total += item.price * item.quantity;

        totalQuantity += item.quantity;


        const div = document.createElement("div");

        div.className = "cart-item";

        div.innerHTML = `

            <div>

                <h4>${item.name}</h4>

                <p>${formatPrice(item.price * item.quantity)}</p>

                <div class="quantity-controls">

                    <button data-action="decrease" data-id="${item.id}">
                        -
                    </button>

                    <span>${item.quantity}</span>

                    <button data-action="increase" data-id="${item.id}">
                        +
                    </button>

                </div>

            </div>

            <button
                class="remove-item"
                data-action="remove"
                data-id="${item.id}"
                aria-label="Remove ${item.name}">

                <i class="fas fa-trash"></i>

            </button>

        `;

        cartItems.appendChild(div);

    });


    cartCount.textContent = totalQuantity;

    cartTotal.textContent = formatPrice(total);

}

document.getElementById("cartItems").addEventListener("click", event => {

    const button = event.target.closest("button");

    if (!button) return;

    const id = Number(button.dataset.id);

    const action = button.dataset.action;

    const item = cart.find(product => product.id === id);

    if (!item) return;


    if (action === "increase") {

        item.quantity++;

    }

    else if (action === "decrease") {

        item.quantity--;

        if (item.quantity <= 0) {

            cart = cart.filter(product => product.id !== id);

        }

    }

    else if (action === "remove") {

        cart = cart.filter(product => product.id !== id);

    }


    saveCart();

});

const cartOverlay = document.getElementById("cartOverlay");


document.getElementById("cartButton").addEventListener("click", () => {

    cartOverlay.classList.add("active");

});


document.getElementById("closeCart").addEventListener("click", () => {

    cartOverlay.classList.remove("active");

});


cartOverlay.addEventListener("click", event => {

    if (event.target === cartOverlay) {

        cartOverlay.classList.remove("active");

    }

});

function checkout() {

    if (cart.length === 0) {

        alert("Your shopping cart is empty!");

        return;

    }

    if (!/^260\d{9}$/.test(STORE.whatsapp)) {

        alert("Please configure the store's WhatsApp number first.");

        return;

    }


    let message = `Hello ${STORE.name}!\n\n`;

    message += "I would like to place an order:\n\n";


    cart.forEach(item => {

        message += `${item.name}\n`;

        message += `Quantity: ${item.quantity}\n`;

        message += `Subtotal: ${formatPrice(item.price * item.quantity)}\n\n`;

    });


    const total = cart.reduce((sum, item) => {

        return sum + (item.price * item.quantity);

    }, 0);


    message += `Total: ${formatPrice(total)}\n\n`;

    message += "Please assist me with delivery arrangements.\n";

    message += "Thank you!";


    const whatsappURL =
        `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(message)}`;


    window.open(whatsappURL, "_blank");

}

document.getElementById("checkoutButton")
    .addEventListener("click", checkout);

document.getElementById("contactWhatsApp")
    .addEventListener("click", event => {

        event.preventDefault();

        if (!/^260\d{9}$/.test(STORE.whatsapp)) {

            alert("Please configure the store's WhatsApp number first.");

            return;

        }

        const message = encodeURIComponent(
            "Hello AVON Perfume Store! I would like to make an enquiry."
        );

        window.open(
            `https://wa.me/${STORE.whatsapp}?text=${message}`,
            "_blank"
        );

    });

const menuToggle = document.getElementById("menuToggle");

const nav = document.getElementById("nav");


menuToggle.addEventListener("click", () => {

    nav.classList.toggle("active");

});


document.querySelectorAll(".nav a").forEach(link => {

    link.addEventListener("click", () => {

        nav.classList.remove("active");

    });

});



document.getElementById("newsletterForm")
    .addEventListener("submit", event => {

        event.preventDefault();

        const email = document.getElementById("newsletterEmail").value;

        document.getElementById("newsletterMessage").textContent =
            "Thank you! Newsletter registration requires server setup.";

        console.log("Newsletter email submitted:", email);

        event.target.reset();

    });

document.getElementById("year").textContent =
    new Date().getFullYear();


displayProducts();

updateCart();
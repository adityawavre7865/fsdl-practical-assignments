const products = [
    {
        id: 1,
        name: "Noir Leather Jacket",
        price: 1290,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
        category: "Outerwear"
    },
    {
        id: 2,
        name: "Emerald Silk Gown",
        price: 3500,
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80",
        category: "Evening Wear"
    },
    {
        id: 3,
        name: "Aether Minimal Sneakers",
        price: 850,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
        category: "Footwear"
    },
    {
        id: 4,
        name: "Gold Aviator Frames",
        price: 450,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80",
        category: "Accessories"
    },
    {
        id: 5,
        name: "Premium Silk Scarf",
        price: 320,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
        category: "Accessories"
    },
    {
        id: 6,
        name: "Onyx Digital Chronograph",
        price: 1580,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
        category: "Watches"
    },
    {
        id: 7,
        name: "Midnight Silver Watch",
        price: 2100,
        image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
        category: "Watches"
    },
    {
        id: 8,
        name: "Classic Gold Piece",
        price: 4200,
        image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=800&q=80",
        category: "Watches"
    },
    {
        id: 9,
        name: "Rose Edition Watch",
        price: 1850,
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=80",
        category: "Watches"
    },
    {
        id: 10,
        name: "Wool Trench Coat",
        price: 2400,
        image: "https://images.unsplash.com/photo-1591047139829-d91aec36caea?auto=format&fit=crop&w=800&q=80",
        category: "Outerwear"
    },
    {
        id: 11,
        name: "Velvet Evening Suit",
        price: 2900,
        image: "https://images.unsplash.com/photo-1598808503744-44d8b2d4f58a?auto=format&fit=crop&w=800&q=80",
        category: "Evening Wear"
    },
    {
        id: 12,
        name: "Leather Chelsea Boots",
        price: 950,
        image: "https://images.unsplash.com/photo-1621946081440-a54167909623?auto=format&fit=crop&w=800&q=80",
        category: "Footwear"
    },
    {
        id: 13,
        name: "Diamond Stud Earrings",
        price: 5200,
        image: "https://images.unsplash.com/photo-1596944214946-174074c6f99e?auto=format&fit=crop&w=800&q=80",
        category: "Accessories"
    },
    {
        id: 14,
        name: "Titanium Sport Master",
        price: 3500,
        image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=800&q=80",
        category: "Watches"
    },
    {
        id: 15,
        name: "Executive Leather Strap",
        price: 1950,
        image: "https://images.unsplash.com/photo-1517502474097-f9b30659dadb?auto=format&fit=crop&w=800&q=80",
        category: "Watches"
    },
    {
        id: 16,
        name: "Blue Dial Divers Watch",
        price: 2800,
        image: "https://images.unsplash.com/photo-1547996160-81dfa63595dd?auto=format&fit=crop&w=800&q=80",
        category: "Watches"
    },
    {
        id: 17,
        name: "Minimalist Slate Watch",
        price: 1400,
        image: "https://images.unsplash.com/photo-1509112756314-34a0badb29d4?auto=format&fit=crop&w=800&q=80",
        category: "Watches"
    },
    {
        id: 18,
        name: "Gold Mesh Evening Watch",
        price: 3100,
        image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&w=800&q=80",
        category: "Watches"
    }
];

let cart = JSON.parse(localStorage.getItem('luxe_cart')) || [];

// DOM Elements
const productGrid = document.querySelector('.product-grid');
const cartSidebar = document.querySelector('.cart-sidebar');
const cartItemsContainer = document.querySelector('.cart-items');
const cartCount = document.getElementById('cart-count');
const totalPriceElement = document.getElementById('total-price');

// Global Placeholder
const PLACEHOLDER = "https://images.unsplash.com/photo-1491336477066-31156b5e4f35?auto=format&fit=crop&w=800&q=80";

// Initialize App
function init() {
    renderProducts();
    updateCartUI();
    setupEventListeners();
}

function renderProducts() {
    if (!productGrid) return;
    const featured = products.slice(0, 6);
    productGrid.innerHTML = featured.map(product => `
        <div class="product-card glass">
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='${PLACEHOLDER}'">
            <div class="product-info">
                <span style="color: grey; font-size: 0.8rem; text-transform: uppercase;">${product.category}</span>
                <h3>${product.name}</h3>
                <span class="product-price">$${product.price.toLocaleString()}</span>
                <button class="add-btn" onclick="addToCart(${product.id})">Add to Bag</button>
            </div>
        </div>
    `).join('');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    toggleCart(true);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function updateCartUI() {
    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalItems;

    // Update items
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='${PLACEHOLDER}'">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">$${(item.price * item.quantity).toLocaleString()}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.3rem;">
                    Qty: ${item.quantity} 
                    <span style="margin-left: 1rem; color: #ff4444; cursor: pointer;" onclick="removeFromCart(${item.id})">Remove</span>
                </div>
            </div>
        </div>
    `).join('');

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPriceElement.innerText = `$${total.toLocaleString()}`;
}

function saveCart() {
    localStorage.setItem('luxe_cart', JSON.stringify(cart));
}

function toggleCart(open) {
    if (open) {
        cartSidebar.classList.add('open');
    } else {
        cartSidebar.classList.remove('open');
    }
}

// Search Logic
// Search Logic
function toggleSearch(open) {
    const searchOverlay = document.getElementById('search-overlay');
    const searchInput = document.querySelector('.search-input');
    if (!searchOverlay) return;
    if (open) {
        searchOverlay.classList.add('open');
        searchInput.focus();
    } else {
        searchOverlay.classList.remove('open');
    }
}

function handleSearch(event) {
    const query = event.target.value.toLowerCase();

    // If on shop page, use its render logic
    const shopGrid = document.getElementById('shop-grid');
    if (shopGrid) {
        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );

        shopGrid.innerHTML = filtered.map(product => `
            <div class="product-card glass" style="margin-bottom: 2rem;">
                <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='${PLACEHOLDER}'">
                <div class="product-info">
                    <span style="color: grey; font-size: 0.8rem; text-transform: uppercase;">${product.category}</span>
                    <h3>${product.name}</h3>
                    <span class="product-price">$${product.price.toLocaleString()}</span>
                    <button class="add-btn" onclick="addToCart(${product.id})">Add to Bag</button>
                </div>
            </div>
        `).join('');
    } else if (event.key === 'Enter') {
        window.location.href = `shop.html?search=${query}`;
    }
}

// Account Logic
function toggleAccount() {
    const dropdown = document.getElementById('account-dropdown');
    if (dropdown) dropdown.classList.toggle('open');
}

function setupEventListeners() {
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Close components on click outside
    document.addEventListener('mousedown', (e) => {
        // Cart
        if (cartSidebar.classList.contains('open') &&
            !cartSidebar.contains(e.target) &&
            !document.querySelector('.cart-icon').contains(e.target)) {
            toggleCart(false);
        }

        // Account
        const accountDropdown = document.getElementById('account-dropdown');
        if (accountDropdown && accountDropdown.classList.contains('open') &&
            !document.querySelector('.account-icon').contains(e.target)) {
            accountDropdown.classList.remove('open');
        }

        // Search
        if (searchOverlay && searchOverlay.classList.contains('open') &&
            !searchOverlay.contains(e.target) &&
            !document.querySelector('.search-icon').contains(e.target)) {
            toggleSearch(false);
        }
    });
}

const checkoutBtn = document.querySelector('.checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your bag is empty.');
            return;
        }
        alert('Thank you for your interest! This is a demo. In a real application, you would be redirected to checkout.');
        cart = [];
        saveCart();
        updateCartUI();
        toggleCart(false);
    });
}

// Start app
init();

// Contact Form Validation
function validateContactForm() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const query = document.getElementById('query').value;

    if (!name || !email || !phone || !query) {
        alert("Please fill in all fields.");
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return false;
    }

    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
        alert("Please enter a valid phone number (at least 10 digits)..");
        return false;
    }

    // Final double-check to prevent overlay from showing on invalid states
    if (!name || !email || !phone || !query) return false;

    // Show success message and redirect
    const successOverlay = document.getElementById('successOverlay');
    const contactForm = document.getElementById('contactForm');

    if (successOverlay) {
        successOverlay.classList.add('show');
        if (contactForm) contactForm.reset();

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    }

    return true;
}

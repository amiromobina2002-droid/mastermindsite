document.addEventListener('DOMContentLoaded', function() {
    console.log("MasterMindSite Advanced Version is ready!");

    // --- 1. پایگاه داده ساختگی ---
    const allProducts = [
        { id: 1, name: 'گوشی موبایل سامسونگ مدل A54', category: 'موبایل', price: 12000000, oldPrice: 15000000, image: 'https://picsum.photos/seed/product1/250/250' },
        { id: 2, name: 'لپ‌تاپ ایسوس مدل VivoBook 15', category: 'لپ‌تاپ', price: 28500000, image: 'https://picsum.photos/seed/product2/250/250' },
        { id: 3, name: 'ساعت هوشمند اپل واچ سری 8', category: 'گجت پوشیدنی', price: 12350000, oldPrice: 13000000, image: 'https://picsum.photos/seed/product3/250/250' },
        { id: 4, name: 'هدفون بی‌سیم Sony WH-1000XM5', category: 'صوتی و تصویری', price: 9800000, image: 'https://picsum.photos/seed/product4/250/250' },
        { id: 5, name: 'کفش ورزشی نایک مدل Air Max', category: 'پوشاک', price: 4500000, oldPrice: 5200000, image: 'https://picsum.photos/seed/shoes/250/250' },
        { id: 6, name: 'تلویزیون سامسونگ 55 اینچ 4K', category: 'صوتی و تصویری', price: 18000000, image: 'https://picsum.photos/seed/tv/250/250' },
        { id: 7, name: 'کتاب «آرامش خاطر» اثر «دیل کارنگی»', category: 'کتاب', price: 150000, image: 'https://picsum.photos/seed/book/250/250' },
        { id: 8, name: 'عطر مردانه جیوانچی واتر', category: 'عطر', price: 2200000, image: 'https://picsum.photos/seed/perfume/250/250' },
        { id: 9, name: 'ماوس گیمینگ ریزر ناگا', category: 'لوازم جانبی کامپیوتر', price: 1800000, image: 'https://picsum.photos/seed/mouse/250/250' },
        { id: 10, name: 'گوشی موبایل شیائومی مدل 13', category: 'موبایل', price: 16500000, image: 'https://picsum.photos/seed/mobile2/250/250' },
    ];

    // --- 2. استیت‌های جهانی برنامه ---
    let currentProducts = [...allProducts];
    let cart = JSON.parse(localStorage.getItem('mastermindCart')) || [];
    let compareList = [];

    // --- 3. گرفتن عناصر DOM ---
    const productsGrid = document.getElementById('productsGrid');
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const categoryFiltersContainer = document.getElementById('categoryFilters');
    const cartCount = document.getElementById('cartCount');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const productModal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBody');
    const compareModal = document.getElementById('compareModal');
    const compareBody = document.getElementById('compareBody');
    const compareBtn = document.getElementById('compareBtn');
    const compareCount = document.getElementById('compareCount');

    // --- 4. توابع اصلی ---

    // رندر کردن محصولات
    function renderProducts(products) {
        productsGrid.innerHTML = '';
        if (products.length === 0) {
            productsGrid.innerHTML = '<p class="no-products-found">محصولی یافت نشد.</p>';
            return;
        }
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${product.oldPrice ? `<span class="discount-badge">${Math.round((1 - product.price / product.oldPrice) * 100)}%</span>` : ''}
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="price-container">
                        ${product.oldPrice ? `<span class="old-price">${product.oldPrice.toLocaleString('fa-IR')}</span>` : ''}
                        <span class="new-price">${product.price.toLocaleString('fa-IR')} تومان</span>
                    </div>
                    <div class="product-actions">
                        <button class="add-to-cart" data-id="${product.id}">افزودن به سبد</button>
                        <input type="checkbox" class="compare-checkbox" data-id="${product.id}" title="برای مقایسه انتخاب کنید">
                    </div>
                </div>
            `;
            productsGrid.appendChild(productCard);
        });
        attachProductEventListeners();
    }

    // رندر کردن دسته‌بندی‌ها برای فیلتر
    function renderCategoryFilters() {
        const categories = [...new Set(allProducts.map(p => p.category))];
        categoryFiltersContainer.innerHTML = '<label><input type="checkbox" name="category" value="all" checked> همه</label>';
        categories.forEach(cat => {
            const label = document.createElement('label');
            label.innerHTML = `<input type="checkbox" name="category" value="${cat}"> ${cat}`;
            categoryFiltersContainer.appendChild(label);
        });
    }

    // رندر کردن سبد خرید
    function renderCart() {
        cartItems.innerHTML = '';
        let total = 0;
        if (cart.length === 0) {
            cartItems.innerHTML = '<p>سبد خرید شما خالی است.</p>';
        } else {
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${item.price.toLocaleString('fa-IR')} تومان</div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                    </div>
                `;
                cartItems.appendChild(cartItem);
                total += item.price * item.quantity;
            });
        }
        cartTotal.textContent = total.toLocaleString('fa-IR');
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        localStorage.setItem('mastermindCart', JSON.stringify(cart));
    }

    // رندر کردن مودال محصول
    function renderProductModal(productId) {
        const product = allProducts.find(p => p.id === productId);
        if (!product) return;

        modalBody.innerHTML = `
            <div style="display: flex; gap: 2rem;">
                <img src="${product.image}" alt="${product.name}" style="width: 50%; object-fit: contain;">
                <div>
                    <h2>${product.name}</h2>
                    <p>دسته‌بندی: ${product.category}</p>
                    <div class="price-container" style="margin: 1rem 0;">
                        ${product.oldPrice ? `<span class="old-price">${product.oldPrice.toLocaleString('fa-IR')}</span>` : ''}
                        <span class="new-price" style="font-size: 1.5rem;">${product.price.toLocaleString('fa-IR')} تومان</span>
                    </div>
                    <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است.</p>
                    <button class="add-to-cart" data-id="${product.id}" style="width: 100%; margin-top: 1rem;">افزودن به سبد خرید</button>
                </div>
            </div>
        `;
        productModal.style.display = 'block';
        // اضافه کردن لیسنر دوباره برای دکمه داخل مودال
        modalBody.querySelector('.add-to-cart').addEventListener('click', handleAddToCart);
    }

    // رندر کردن مودال مقایسه
    function renderCompareModal() {
        if (compareList.length < 2) {
            alert('لطفا حداقل دو محصول برای مقایسه انتخاب کنید.');
            return;
        }
        const productsToCompare = allProducts.filter(p => compareList.includes(p.id));
        
        let tableHTML = '<table class="compare-table"><thead><tr><th>ویژگی</th>';
        productsToCompare.forEach(p => tableHTML += `<th>${p.name}</th>`);
        tableHTML += '</tr></thead><tbody>';

        tableHTML += '<tr><td>تصویر</td>';
        productsToCompare.forEach(p => tableHTML += `<td><img src="${p.image}" alt="${p.name}"></td>`);
        tableHTML += '</tr>';

        tableHTML += '<tr><td>قیمت</td>';
        productsToCompare.forEach(p => tableHTML += `<td>${p.price.toLocaleString('fa-IR')}</td>`);
        tableHTML += '</tr>';
        
        tableHTML += '<tr><td>دسته‌بندی</td>';
        productsToCompare.forEach(p => tableHTML += `<td>${p.category}</td>`);
        tableHTML += '</tr>';

        tableHTML += '</tbody></table>';
        compareBody.innerHTML = tableHTML;
        compareModal.style.display = 'block';
    }


    // --- 5. توابع کنترلر ---

    function applyFiltersAndSort() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);
        const sortValue = sortSelect.value;

        let filtered = allProducts;

        // فیلتر جستجو
        if (searchTerm) {
            filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));
        }

        // فیلتر دسته‌بندی
        if (!selectedCategories.includes('all')) {
            filtered = filtered.filter(p => selectedCategories.includes(p.category));
        }
        
        // مرتب‌سازی
        switch (sortValue) {
            case 'price-asc':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name, 'fa'));
                break;
            default:
                filtered.sort((a, b) => a.id - b.id); // پیش‌فرض
        }

        currentProducts = filtered;
        renderProducts(currentProducts);
    }

    function handleAddToCart(event) {
        const productId = parseInt(event.target.dataset.id);
        const product = allProducts.find(p => p.id === productId);
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        renderCart();
    }

    function handleQuantityChange(event) {
        const productId = parseInt(event.target.dataset.id);
        const action = event.target.dataset.action;
        const item = cart.find(item => item.id === productId);

        if (item) {
            if (action === 'increase') {
                item.quantity++;
            } else if (action === 'decrease' && item.quantity > 1) {
                item.quantity--;
            } else if (action === 'decrease' && item.quantity === 1) {
                cart = cart.filter(item => item.id !== productId);
            }
        }
        renderCart();
    }
    
    function handleCompareSelection(event) {
        const productId = parseInt(event.target.dataset.id);
        if (event.target.checked) {
            if (compareList.length < 4) {
                compareList.push(productId);
            } else {
                event.target.checked = false;
                alert('حداکثر می‌توانید 4 محصول را برای مقایسه انتخاب کنید.');
            }
        } else {
            compareList = compareList.filter(id => id !== productId);
        }
        
        if (compareList.length > 1) {
            compareBtn.style.display = 'block';
            compareCount.textContent = compareList.length;
        } else {
            compareBtn.style.display = 'none';
        }
    }


    // --- 6. اتصال رویدادها (Event Listeners) ---
    function attachProductEventListeners() {
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', handleAddToCart);
        });
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // اگر روی دکمه یا چک‌باکس کلیک نشده باشد، مودال را باز کن
                if (!e.target.classList.contains('add-to-cart') && !e.target.classList.contains('compare-checkbox')) {
                    const productId = parseInt(card.querySelector('.add-to-cart').dataset.id);
                    renderProductModal(productId);
                }
            });
        });
        document.querySelectorAll('.compare-checkbox').forEach(cb => {
            cb.addEventListener('change', handleCompareSelection);
        });
    }

    searchInput.addEventListener('input', applyFiltersAndSort);
    sortSelect.addEventListener('change', applyFiltersAndSort);
    categoryFiltersContainer.addEventListener('change', applyFiltersAndSort);

    // رویدادهای سبد خرید
    document.querySelector('.cart-toggle-btn').addEventListener('click', () => cartSidebar.classList.add('show'));
    document.getElementById('closeCartBtn').addEventListener('click', () => cartSidebar.classList.remove('show'));
    cartItems.addEventListener('click', (e) => {
        if (e.target.classList.contains('quantity-btn')) {
            handleQuantityChange(e);
        }
    });

    // رویدادهای مودال محصول
    document.getElementById('closeModalBtn').addEventListener('click', () => productModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === productModal) productModal.style.display = 'none';
        if (e.target === compareModal) compareModal.style.display = 'none';
    });

    // رویدادهای مودال مقایسه
    compareBtn.addEventListener('click', renderCompareModal);
    document.getElementById('closeCompareBtn').addEventListener('click', () => compareModal.style.display = 'none');

    // --- 7. مقداردهی اولیه ---
    renderCategoryFilters();
    renderProducts(allProducts);
    renderCart();
});
const userId = localStorage.getItem('warehouse_user_id');
const container = document.getElementById('card-container');
const emptyMsg = document.getElementById('empty-msg');

async function loadCart() {
    // Проверка авторизации
    if (!userId) {
        emptyMsg.textContent = 'Пожалуйста, войдите в систему';
        emptyMsg.style.display = 'block';
        return;
    }

    const API_URL = `/cart?user_id=${userId}`;
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        let cartData = await response.json();

        // Если пришёл массив, преобразуем в объект { itemId: quantity }
        if (Array.isArray(cartData)) {
            const newCart = {};
            for (const item of cartData) {
                newCart[item.id] = item.quantity;
            }
            cartData = newCart;
        }

        // Проверяем, пуста ли корзина
        if (Object.keys(cartData).length === 0) {
            emptyMsg.style.display = 'block';
            return;
        }

        emptyMsg.style.display = 'none';
        await renderCart(cartData);
    } catch (error) {
        console.error('Ошибка при загрузке корзины:', error);
        emptyMsg.textContent = 'Не удалось загрузить корзину. Попробуйте позже.';
        emptyMsg.style.display = 'block';
    }
}

async function renderCart(cartData) {
    container.innerHTML = '';
    for (const itemId in cartData) {
        const quantity = cartData[itemId];
        try {
            const res = await fetch(`/items/${itemId}`);
            if (!res.ok) {
                console.warn(`Товар с id ${itemId} не найден (${res.status})`);
                continue;
            }
            const item = await res.json();

            const card = document.createElement('div');
            card.className = 'card';

            const totalWeight = (item.weight || 0) * quantity;
            card.innerHTML = `
                <h3 class="card-title">${escapeHtml(item.name)}</h3>
                <p>Количество: <b>${quantity} копий</b></p>
                <p>Общий вес: ${totalWeight} Гб</p>
            `;
            container.appendChild(card);
        } catch (err) {
            console.error(`Ошибка загрузки товара ${itemId}:`, err);
        }
    }
}

// Защита от XSS через названия игр (функция активна)
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

loadCart();
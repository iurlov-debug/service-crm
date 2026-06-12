// ТехноУчёт v1.0 — Панель управления мастерской
// Данные: 3 инженерных заказа + дополнительные поля

let orders = [
    {
        id: "RN-2401",
        device: "Ноутбук Asus ROG",
        issue: "КЗ по линии 19V, замена чарджера / MOSFET",
        status: "diagnostic",
        statusText: "Диагностика",
        price: "3 200 ₽",
        active: true
    },
    {
        id: "RN-2402",
        device: "Монитор LG 27\"",
        issue: "Циклическая перезагрузка, сухие конденсаторы блока питания",
        status: "repair",
        statusText: "Пайка/Ремонт",
        price: "2 100 ₽",
        active: true
    },
    {
        id: "RN-2403",
        device: "Системный блок ПК",
        issue: "Не включается, диагностика цепей питания / КЗ на 12V",
        status: "waiting",
        statusText: "Ожидание запчасти",
        price: "4 500 ₽",
        active: true
    }
];

// Функция для обновления счётчиков (активные ремонты + карточки)
function updateAllCounters() {
    // Активные ремонты — это заказы, у которых active === true
    const activeCount = orders.filter(order => order.active === true).length;
    const activeSpan = document.getElementById('activeRepairsCount');
    if (activeSpan) activeSpan.innerText = activeCount;
    
    // Статистика по карточкам
    const inProgressCount = orders.filter(order => order.status === 'diagnostic' || order.status === 'repair').length;
    const waitingPartsCount = orders.filter(order => order.status === 'waiting').length;
    const readyCount = orders.filter(order => order.status === 'ready').length;
    
    const statInProgress = document.getElementById('statInProgress');
    const statWaitingParts = document.getElementById('statWaitingParts');
    const statReady = document.getElementById('statReady');
    
    if (statInProgress) statInProgress.innerText = inProgressCount;
    if (statWaitingParts) statWaitingParts.innerText = waitingPartsCount;
    if (statReady) statReady.innerText = readyCount;
}

// Рендер таблицы заказов (чистый DOM)
function renderOrdersTable() {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    orders.forEach((order, index) => {
        const row = document.createElement('tr');
        
        // ID
        const tdId = document.createElement('td');
        tdId.innerText = order.id;
        row.appendChild(tdId);
        
        // Устройство
        const tdDevice = document.createElement('td');
        tdDevice.innerText = order.device;
        row.appendChild(tdDevice);
        
        // Неисправность
        const tdIssue = document.createElement('td');
        tdIssue.innerText = order.issue;
        row.appendChild(tdIssue);
        
        // Статус (с цветным индикатором)
        const tdStatus = document.createElement('td');
        const statusSpan = document.createElement('span');
        statusSpan.className = `status-badge status-${order.status}`;
        // Расшифровка статуса текстом
        let displayStatus = '';
        switch(order.status) {
            case 'diagnostic': displayStatus = 'Диагностика'; break;
            case 'repair': displayStatus = 'Пайка/Ремонт'; break;
            case 'waiting': displayStatus = 'Ожидают запчасти'; break;
            case 'ready': displayStatus = 'Готов'; break;
            default: displayStatus = order.statusText;
        }
        statusSpan.innerText = displayStatus;
        tdStatus.appendChild(statusSpan);
        row.appendChild(tdStatus);
        
        // Стоимость
        const tdPrice = document.createElement('td');
        tdPrice.className = 'price-cell';
        tdPrice.innerText = order.price;
        row.appendChild(tdPrice);
        
        // Действие (кнопка Завершить ремонт)
        const tdAction = document.createElement('td');
        const btn = document.createElement('button');
        btn.innerText = 'Завершить ремонт';
        btn.className = 'complete-btn';
        // Если статус уже "ready" или заказ не активен — блокируем
        if (order.status === 'ready' || order.active === false) {
            btn.disabled = true;
        } else {
            btn.disabled = false;
        }
        
        // Привязываем событие клика с сохранением индекса
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            completeRepair(index);
        });
        
        tdAction.appendChild(btn);
        row.appendChild(tdAction);
        
        tbody.appendChild(row);
    });
}

// Логика завершения ремонта
function completeRepair(orderIndex) {
    const order = orders[orderIndex];
    // Если уже завершён или не активен — выходим
    if (order.status === 'ready' || order.active === false) return;
    
    // Меняем статус на "ready" (зелёный)
    order.status = 'ready';
    order.statusText = 'Готов';
    order.active = false;
    
    // Перерисовываем таблицу
    renderOrdersTable();
    // Обновляем счётчик активных ремонтов и карточки статистики
    updateAllCounters();
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    // Проставляем начальные значения (гарантия, что все active = true для неготовых)
    orders.forEach(order => {
        if (order.status !== 'ready') {
            order.active = true;
        } else {
            order.active = false;
        }
    });
    
    // Первый рендер
    renderOrdersTable();
    updateAllCounters();
});
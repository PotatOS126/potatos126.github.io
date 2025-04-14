// 从location.js导入地点配置
import locations from './location.js';
// 从item.js导入道具配置
import { items, debugItems } from './item.js';

// 通知管理器 - 统一管理各种类型的弹窗通知
class NotificationManager {
    constructor() {
        this.notifications = []; // 当前显示的通知列表
        this.counter = 0; // 用于生成唯一ID
        this.maxNotifications = 3; // 最大同时显示的通知数量
        this.notificationContainer = null; // 通知容器
        
        // 添加全局样式
        this.addStyles();
        // 创建通知容器
        this.createNotificationContainer();
    }
    
    createNotificationContainer() {
        // 检查是否已存在容器
        if (document.getElementById('notification-container')) {
            this.notificationContainer = document.getElementById('notification-container');
            return;
        }
        
        // 创建容器
        this.notificationContainer = document.createElement('div');
        this.notificationContainer.id = 'notification-container';
        document.body.appendChild(this.notificationContainer);
    }
    
    addStyles() {
        // 如果已经存在样式，就不再添加
        if (document.querySelector('style[data-notification-manager]')) {
            return;
        }
        
        const style = document.createElement('style');
        style.textContent = `
            /* 通知容器 */
            #notification-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding-top: 15px;
                z-index: 9999;
                pointer-events: none; /* 允许点击容器下方的元素 */
                max-height: 100vh;
                overflow: hidden;
            }
            
            /* 基础通知样式 */
            .game-notification {
                position: relative;
                font-family: 'Microsoft YaHei', sans-serif;
                box-sizing: border-box;
                transition: all 0.3s ease, transform 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28);
                opacity: 0;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                border-radius: 8px;
                overflow: hidden;
                max-width: 80%;
                width: auto;
                padding: 0;
                line-height: 1.5;
                margin-bottom: 10px;
                transform: translateY(-20px);
                pointer-events: auto; /* 确保通知可以点击 */
            }
            
            /* 显示状态样式 */
            .game-notification.show {
                opacity: 1;
                transform: translateY(0);
            }
            
            /* 通知内容容器 */
            .notification-content {
                display: flex;
                align-items: center;
                padding: 12px 16px;
                background-color: rgba(50, 50, 50, 0.95);
                color: white;
                border-left: 4px solid #1890ff;
            }
            
            /* 通知图标 */
            .notification-icon {
                margin-right: 12px;
                font-size: 20px;
            }
            
            /* 通知消息 */
            .notification-message {
                flex: 1;
                font-size: 15px;
            }
            
            /* 关闭按钮 */
            .notification-close {
                margin-left: 12px;
                cursor: pointer;
                opacity: 0.6;
                transition: opacity 0.2s;
                font-size: 16px;
            }
            
            .notification-close:hover {
                opacity: 1;
            }
            
            /* 成功通知 */
            .notification-success .notification-content {
                border-left-color: #52c41a;
            }
            
            /* 错误通知 */
            .notification-error .notification-content {
                border-left-color: #f5222d;
            }
            
            /* 警告通知 */
            .notification-warning .notification-content {
                border-left-color: #faad14;
            }
            
            /* 信息通知 */
            .notification-info .notification-content {
                border-left-color: #1890ff;
            }
            
            /* 道具获得通知 */
            .notification-item .notification-content {
                border-left-color: #722ed1;
                background-color: rgba(114, 46, 209, 0.85);
            }
            
            /* 临时通知（如资源变化） */
            .notification-temp .notification-content {
                padding: 10px 16px;
                background-color: rgba(0, 0, 0, 0.75);
                border-left-color: #096dd9;
            }
            
            /* 动画效果 */
            @keyframes notification-fadeIn {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes notification-fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-20px); }
            }
            
            /* 资源相关通知样式 */
            .notification-content.hunger {
                border-left-color: #fa8c16;
            }
            
            .notification-content.fatigue {
                border-left-color: #eb2f96;
            }
            
            .notification-content.dishonor {
                border-left-color: #f5222d;
            }
            
            .notification-content.clue {
                border-left-color: #52c41a;
            }
            
            .notification-content.trace {
                border-left-color: #1890ff;
            }
            
            /* 通知中的强调内容 */
            .notification-highlight {
                font-weight: bold;
                margin: 0 2px;
            }
            
            /* 标准行动反馈样式 */
            .action-feedback {
                position: fixed;
                top: 50%; /* 居中显示 */
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: rgba(0, 0, 0, 0.85);
                color: white;
                padding: 14px 22px;
                border-radius: 8px;
                font-size: 1rem;
                max-width: 80%;
                text-align: center;
                z-index: 9998; /* 比通知栏低一级 */
                animation: fadeIn 0.5s;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
            }
            
            .action-feedback.fade-out {
                animation: fadeOut 0.5s;
            }
            
            @keyframes fadeIn {
                from {opacity: 0; transform: translate(-50%, -40%);}
                to {opacity: 1; transform: translate(-50%, -50%);}
            }
            
            @keyframes fadeOut {
                from {opacity: 1; transform: translate(-50%, -50%);}
                to {opacity: 0; transform: translate(-50%, -60%);}
            }
        `;
        
        style.setAttribute('data-notification-manager', 'true');
        document.head.appendChild(style);
    }
    
    // 显示通知
    notify(options) {
        const {
            message,
            type = 'info', // 'success', 'error', 'warning', 'info', 'item', 'temp'
            duration = 4500,
            position = 'top', // 仅支持顶部通知，忽略其他位置设置
            icon = this.getDefaultIcon(type),
            closable = true,
            resourceType = null, // 资源类型：'hunger', 'fatigue', 'dishonor', 'clue', 'trace'
            onClose = null // 关闭通知后的回调函数
        } = options;
        
        // 限制最大通知数量，先关闭一些旧通知
        this.limitNotifications();
        
        // 生成唯一ID
        const id = `notification-${Date.now()}-${this.counter++}`;
        
        // 创建通知元素
        const notification = document.createElement('div');
        notification.id = id;
        notification.className = `game-notification notification-${type}`;
        
        // 创建内容容器
        const content = document.createElement('div');
        content.className = `notification-content ${resourceType || ''}`;
        
        // 添加图标
        const iconElement = document.createElement('div');
        iconElement.className = 'notification-icon';
        iconElement.innerHTML = icon;
        content.appendChild(iconElement);
        
        // 添加消息文本
        const messageElement = document.createElement('div');
        messageElement.className = 'notification-message';
        messageElement.innerHTML = message;
        content.appendChild(messageElement);
        
        // 添加关闭按钮
        if (closable) {
            const closeElement = document.createElement('div');
            closeElement.className = 'notification-close';
            closeElement.innerHTML = '×';
            closeElement.onclick = (e) => {
                e.stopPropagation(); // 防止事件冒泡
                this.close(id, onClose); // 传递回调函数
            };
            content.appendChild(closeElement);
        }
        
        notification.appendChild(content);
        // 添加到通知容器
        this.notificationContainer.appendChild(notification);
        
        // 设置定时器
        let timer = null;
        if (duration > 0) {
            timer = setTimeout(() => {
                this.close(id, onClose); // 传递回调函数
            }, duration);
        }
        
        // 添加到通知列表
        this.notifications.push({
            id,
            element: notification,
            timer: timer,
            onClose // 保存回调函数
        });
        
        // 添加显示动画
        // 使用requestAnimationFrame确保样式计算正确
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                notification.classList.add('show');
            });
        });
        
        return id;
    }
    
    // 关闭通知
    close(id, customCallback = null) {
        const notificationIndex = this.notifications.findIndex(n => n.id === id);
        if (notificationIndex === -1) return;
        
        const { element, timer, onClose } = this.notifications[notificationIndex];
        
        // 清除定时器
        if (timer) {
            clearTimeout(timer);
        }
        
        // 执行回调函数
        const callback = customCallback || onClose;
        if (typeof callback === 'function') {
            callback();
        }
        
        // 移除通知对象，防止内存泄漏
        this.notifications.splice(notificationIndex, 1);
        
        // 如果元素已经不在DOM中，直接返回
        if (!element || !element.parentNode) {
            return;
        }
        
        // 移除显示状态类
        element.classList.remove('show');
        
        // 延迟移除元素
        setTimeout(() => {
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, 300);
    }
    
    // 关闭所有通知
    closeAll() {
        const notifications = [...this.notifications];
        this.notifications = []; // 清空通知数组
        
        // 清理每个通知的定时器和DOM元素
        notifications.forEach(notification => {
            const { id, element, timer } = notification;
            
            // 清除定时器
            if (timer) {
                clearTimeout(timer);
            }
            
            // 如果元素存在并在DOM中，移除它
            if (element && element.parentNode) {
                element.classList.remove('show');
                
                // 立即移除元素，不再等待动画
                try {
                    element.parentNode.removeChild(element);
                } catch (e) {
                    console.error('移除通知元素时出错:', e);
                }
            }
        });
    }
    
    // 限制最大通知数量
    limitNotifications() {
        // 如果通知数量超过限制，关闭最早的通知
        if (this.notifications.length >= this.maxNotifications) {
            // 计算需要关闭的通知数量
            const toCloseCount = this.notifications.length - this.maxNotifications + 1;
            
            // 获取需要关闭的通知
            const toClose = this.notifications.slice(0, toCloseCount);
            
            // 立即关闭多余的通知，不使用动画效果
            toClose.forEach(notification => {
                const { id, element, timer } = notification;
                
                // 清除定时器
                if (timer) clearTimeout(timer);
                
                // 从DOM中立即移除
                if (element && element.parentNode) {
                    element.parentNode.removeChild(element);
                }
                
                // 从通知列表中移除
                const index = this.notifications.findIndex(n => n.id === id);
                if (index !== -1) {
                    this.notifications.splice(index, 1);
                }
            });
        }
    }
    
    // 获取默认图标
    getDefaultIcon(type) {
        switch (type) {
            case 'success': return '✓';
            case 'error': return '✕';
            case 'warning': return '⚠';
            case 'info': return 'ℹ';
            case 'item': return '🎁';
            case 'temp': return '★';
            default: return '';
        }
    }
    
    // 以下是便捷通知方法
    
    // 成功通知
    success(message, options = {}) {
        return this.notify({
            message,
            type: 'success',
            ...options
        });
    }
    
    // 错误通知
    error(message, options = {}) {
        return this.notify({
            message,
            type: 'error',
            ...options
        });
    }
    
    // 警告通知
    warning(message, options = {}) {
        return this.notify({
            message,
            type: 'warning',
            ...options
        });
    }
    
    // 信息通知
    info(message, options = {}) {
        return this.notify({
            message,
            type: 'info',
            ...options
        });
    }
    
    // 道具获得通知
    item(message, options = {}) {
        return this.notify({
            message,
            type: 'item',
            ...options
        });
    }
    
    // 临时通知
    temp(message, options = {}) {
        return this.notify({
            message,
            type: 'temp',
            duration: 3000,
            ...options
        });
    }
    
    // 资源通知
    resource(resource, message, options = {}) {
        return this.notify({
            message,
            type: 'temp',
            resourceType: resource,
            ...options
        });
    }
}

// 创建全局通知管理器实例
const notificationManager = new NotificationManager();

// 获取资源的显示名称
function getResourceDisplayName(resource) {
    switch(resource) {
        case 'hunger': return '饥饿';
        case 'fatigue': return '疲劳';
        case 'dishonor': return '恶名';
        case 'clue': return '线索';
        case 'trace': return '行踪';
        default: return resource;
    }
}

// 游戏配置
const config = {
    initialResources: {
        hunger: 0,
        fatigue: 0,
        dishonor: 0,
        clue: 0,     // 线索
        trace: 0      // 行踪
    },
    resourceLimits: {
        min: 0,
        max: 21
    },
    // 扑克牌配置
    cards: {
        suits: ['♥', '♦', '♠', '♣'], // 红桃、方块、黑桃、梅花
        values: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
        names: {
            'A': '王牌',
            '2': '二',
            '3': '三',
            '4': '四',
            '5': '五',
            '6': '六',
            '7': '七',
            '8': '八',
            '9': '九',
            '10': '十',
            'J': '军官',
            'Q': '皇后',
            'K': '国王'
        },
        // 花色名称
        suitNames: {
            '♥': '红桃',
            '♦': '方块',
            '♠': '黑桃',
            '♣': '梅花'
        },
        // 21点游戏中的牌面值
        points: {
            'A': [1, 11], // A可以是1或11
            '2': 2,
            '3': 3,
            '4': 4,
            '5': 5,
            '6': 6,
            '7': 7,
            '8': 8,
            '9': 9,
            '10': 10,
            'J': 10,
            'Q': 10,
            'K': 10
        }
    },
    locations: locations,
    items: items,
    debugItems: debugItems
};

// 游戏状态
const gameState = {
    resources: { ...config.initialResources },
    resourceBars: null,
    resourceValues: null,
    cardPiles: null, // 牌堆引用
    cards: { // 各资源已抽到的牌
        hunger: [],
        fatigue: [],
        dishonor: [],
        clue: [],
        trace: []
    },
    // 道具背包
    items: [],
    // 线索牌堆选中状态
    clueSelection: {
        selectedCards: [], // 当前选中的卡牌索引
        cardElements: []   // 对应的DOM元素引用
    },
    // 遭遇计分
    encounters: {
        active: 0,  // 主动遭遇次数
        passive: 0  // 被动遭遇次数
    },
    encounterElements: {
        active: document.getElementById('active-encounter'),
        passive: document.getElementById('passive-encounter')
    },
    currentLocation: '起点',
    visitedLocations: ['起点'],
    availableDestinations: [],
    currentLocationIndex: -1,
    modalVisible: false
};

// 初始化游戏
function initGame() {
    // 初始化资源
    Object.keys(config.initialResources).forEach(resource => {
        gameState.resources[resource] = config.initialResources[resource];
    });
    
    // 初始化UI元素引用
    gameState.resourceBars = {
        hunger: document.getElementById('hunger-bar'),
        fatigue: document.getElementById('fatigue-bar'),
        dishonor: document.getElementById('dishonor-bar'),
        clue: document.getElementById('clue-bar'),
        trace: document.getElementById('trace-bar')
    };
    
    gameState.resourceValues = {
        hunger: document.getElementById('hunger-value'),
        fatigue: document.getElementById('fatigue-value'),
        dishonor: document.getElementById('dishonor-value'),
        clue: document.getElementById('clue-value'),
        trace: document.getElementById('trace-value')
    };
    
    gameState.cardPiles = {
        hunger: document.getElementById('hunger-pile'),
        fatigue: document.getElementById('fatigue-pile'),
        dishonor: document.getElementById('dishonor-pile'),
        clue: document.getElementById('clue-pile'),
        trace: document.getElementById('trace-pile')
    };
    
    gameState.encounterElements = {
        active: document.getElementById('active-encounter'),
        passive: document.getElementById('passive-encounter')
    };
    
    // 创建模态框
    createModal();
    
    // 创建线索选择计数器
    createClueSelectionCounter();
    
    // 初始化道具背包
    createItemInventory();
    
    // 初始化调试功能
    initDebugFeatures();
    
    // 设置当前位置显示
    document.getElementById('current-location').textContent = `当前位置：${gameState.currentLocation}`;
    
    // 生成可前往的目的地
    generateAvailableDestinations();
    
    // 显示可用地点
    displayAvailableLocations();
    
    // 更新资源条
    updateResourceBars();
    
    // 更新遭遇分数
    updateEncounterScores();
    
    // 添加窗口大小变化监听，调整布局
    window.addEventListener('resize', adjustLayout);
    
    // 初始调整布局
    adjustLayout();
}

// 适应布局变化，确保所有内容都能完整显示
function adjustLayout() {
    const resourcesArea = document.querySelector('.resources-area');
    const resourcesRow = document.querySelector('.resources-row');
    const resourceColumns = document.querySelectorAll('.resource-column');
    
    // 计算实际需要的高度
    const columnHeights = Array.from(resourceColumns).map(column => {
        // 获取牌堆中的卡牌数量
        const cardPile = column.querySelector('.card-pile');
        const cards = cardPile.querySelectorAll('.playing-card');
        
        // 基本高度 + 卡牌区域需要的高度
        let baseHeight = 50; // 资源标题和进度条的高度
        let cardsAreaHeight = 0;
        
        if (cards.length > 0) {
            // 计算卡牌区域实际高度
            const cardHeight = 160; // 卡牌高度
            const rowsNeeded = Math.ceil(cards.length / 2); // 假设一行显示2张卡
            cardsAreaHeight = rowsNeeded * (cardHeight + 10); // 加上间距
        } else {
            cardsAreaHeight = 280; // 最小高度
        }
        
        return baseHeight + cardsAreaHeight;
    });
    
    // 找出最高的列高度
    const maxColumnHeight = Math.max(...columnHeights, 350);
    
    // 设置行高
    resourcesRow.style.minHeight = `${maxColumnHeight}px`;
}

// 创建模态框
function createModal() {
    // 检查是否已经存在模态框
    if (document.getElementById('location-modal')) {
        return;
    }
    
    // 创建模态框容器
    const modal = document.createElement('div');
    modal.id = 'location-modal';
    modal.className = 'modal';
    modal.style.display = 'none';
    
    // 创建模态框内容
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    // 创建关闭按钮
    const closeButton = document.createElement('span');
    closeButton.className = 'close-button';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = closeModal;
    
    // 创建标题
    const modalTitle = document.createElement('h3');
    modalTitle.id = 'modal-title';
    modalTitle.className = 'modal-title';
    
    // 创建描述
    const modalDescription = document.createElement('div');
    modalDescription.id = 'modal-description';
    modalDescription.className = 'modal-description';
    
    // 创建行动按钮容器
    const modalActions = document.createElement('div');
    modalActions.id = 'modal-actions';
    modalActions.className = 'modal-actions';
    
    // 添加元素到模态框
    modalContent.appendChild(closeButton);
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(modalDescription);
    modalContent.appendChild(modalActions);
    modal.appendChild(modalContent);
    
    // 添加模态框到页面
    document.body.appendChild(modal);
    
    // 点击模态框外部关闭
    window.onclick = function(event) {
        const modal = document.getElementById('location-modal');
        if (event.target === modal) {
            closeModal();
        }
    };
}

// 生成可前往的目的地
function generateAvailableDestinations() {
    // 清空现有的目的地
    gameState.availableDestinations = [];
    
    // 随机生成1-4个目的地
    const numDestinations = Math.floor(Math.random() * 4) + 1;
    
    // 使用所有可能的地点，不再排除当前位置
    // 这样玩家可以从一个村庄前往另一个村庄
    const possibleLocations = [...config.locations];
    
    // 如果没有可能的地点，直接返回
    if (possibleLocations.length === 0) return;
    
    // 随机选择地点
    for (let i = 0; i < numDestinations; i++) {
        if (possibleLocations.length === 0) break;
        
        // 从可能的地点中随机选择一个
        const randomIndex = Math.floor(Math.random() * possibleLocations.length);
        const selectedLocation = possibleLocations[randomIndex];
        
        // 随机选择描述
        const descIndex = Math.floor(Math.random() * selectedLocation.descriptions.length);
        
        // 添加到可用目的地
        gameState.availableDestinations.push({
            name: selectedLocation.name,
            description: selectedLocation.descriptions[descIndex],
            locationIndex: config.locations.findIndex(loc => loc.name === selectedLocation.name)
        });
        
        // 从可能的地点中移除已选择的地点，确保不会重复
        possibleLocations.splice(randomIndex, 1);
    }
}

// 显示当前可前往的地点
function displayAvailableLocations() {
    const locationsContainer = document.getElementById('locations-container');
    locationsContainer.innerHTML = '';
    
    // 如果没有可用地点，生成新的
    if (gameState.availableDestinations.length === 0) {
        generateAvailableDestinations();
    }
    
    // 为每个可用地点创建UI元素
    gameState.availableDestinations.forEach((destination, index) => {
        const locationElement = document.createElement('div');
        locationElement.className = 'location-option';
        
        // 添加地点名称
        const nameElement = document.createElement('div');
        nameElement.className = 'location-name';
        nameElement.textContent = destination.name;
        locationElement.appendChild(nameElement);
        
        // 添加地点描述
        const descriptionElement = document.createElement('div');
        descriptionElement.className = 'location-description';
        descriptionElement.textContent = destination.description;
        locationElement.appendChild(descriptionElement);
        
        // 添加点击事件
        locationElement.addEventListener('click', () => openLocationModal(destination.name, destination.description, destination.locationIndex));
        
        locationsContainer.appendChild(locationElement);
    });
}

// 创建特殊活动子选项弹窗
function openSpecialActivityModal(action) {
    // 检查是否已经存在子选项弹窗
    let subModal = document.getElementById('special-activity-modal');
    if (!subModal) {
        // 创建子选项弹窗容器
        subModal = document.createElement('div');
        subModal.id = 'special-activity-modal';
        subModal.className = 'modal special-modal';
        
        // 创建子选项弹窗内容
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content special-modal-content';
        
        // 创建关闭按钮
        const closeButton = document.createElement('span');
        closeButton.className = 'close-button';
        closeButton.innerHTML = '&times;';
        closeButton.onclick = closeSpecialActivityModal;
        
        // 创建标题
        const modalTitle = document.createElement('h3');
        modalTitle.id = 'special-modal-title';
        modalTitle.className = 'modal-title';
        
        // 创建描述
        const modalDescription = document.createElement('div');
        modalDescription.id = 'special-modal-description';
        modalDescription.className = 'modal-description';
        
        // 创建子选项容器
        const modalOptions = document.createElement('div');
        modalOptions.id = 'special-modal-options';
        modalOptions.className = 'special-modal-options';
        
        // 添加元素到子选项弹窗
        modalContent.appendChild(closeButton);
        modalContent.appendChild(modalTitle);
        modalContent.appendChild(modalDescription);
        modalContent.appendChild(modalOptions);
        subModal.appendChild(modalContent);
        
        // 添加子选项弹窗到页面
        document.body.appendChild(subModal);
        
        // 点击子选项弹窗外部关闭
        subModal.onclick = function(event) {
            if (event.target === subModal) {
                closeSpecialActivityModal();
            }
        };
    } else {
        // 如果已存在，清空子选项容器
        document.getElementById('special-modal-options').innerHTML = '';
    }
    
    // 设置子选项弹窗内容
    document.getElementById('special-modal-title').textContent = action.name;
    
    // 处理可能的数组形式描述
    if (Array.isArray(action.description)) {
        const randomIndex = Math.floor(Math.random() * action.description.length);
        document.getElementById('special-modal-description').textContent = action.description[randomIndex];
    } else {
        document.getElementById('special-modal-description').textContent = action.description;
    }
    
    // 获取子选项容器
    const optionsContainer = document.getElementById('special-modal-options');
    
    // 检查是否有子选项
    if (action.options && action.options.length > 0) {
        // 为每个子选项创建按钮
        action.options.forEach(option => {
            const optionButton = document.createElement('div');
            optionButton.className = 'special-option';
            
            // 添加选项名称
            const optionName = document.createElement('div');
            optionName.className = 'option-name';
            optionName.textContent = option.name;
            optionButton.appendChild(optionName);
            
            // 添加选项描述 - 处理可能的数组形式
            const optionDescription = document.createElement('div');
            optionDescription.className = 'option-description';
            
            // 如果描述是数组，随机选择一个
            if (Array.isArray(option.description)) {
                const randomIndex = Math.floor(Math.random() * option.description.length);
                optionDescription.textContent = option.description[randomIndex];
            } else {
                optionDescription.textContent = option.description;
            }
            
            optionButton.appendChild(optionDescription);
            
            // 添加效果信息
            if (option.specialEffects || option.damageTypes) {
                const effectsContainer = document.createElement('div');
                effectsContainer.className = 'option-effects';
                
                // 显示特殊效果
                if (option.specialEffects) {
                    for (const [resource, effectValue] of Object.entries(option.specialEffects)) {
                        if (effectValue !== 0 && ['clue', 'trace'].includes(resource)) {
                            const effectElement = document.createElement('div');
                            effectElement.className = 'option-effect';
                            
                            const resourceName = document.createElement('span');
                            switch(resource) {
                                case 'clue': resourceName.textContent = '线索'; break;
                                case 'trace': resourceName.textContent = '行踪'; break;
                                default: resourceName.textContent = resource;
                            }
                            effectElement.appendChild(resourceName);
                            
                            const effectValue = document.createElement('span');
                            if (option.specialEffects[resource] > 0) {
                                // 显示对应数量的加号
                                effectValue.textContent = '+'.repeat(option.specialEffects[resource]);
                                effectValue.className = 'effect-special';
                            } else {
                                // 显示对应数量的减号
                                effectValue.textContent = '-'.repeat(Math.abs(option.specialEffects[resource]));
                                effectValue.className = 'effect-remove';
                            }
                            effectElement.appendChild(effectValue);
                            
                            effectsContainer.appendChild(effectElement);
                        }
                    }
                }
                
                // 显示基础资源损耗
                if (option.damageTypes) {
                    for (const [resource, damageValue] of Object.entries(option.damageTypes)) {
                        if (damageValue !== 0 && ['hunger', 'fatigue', 'dishonor'].includes(resource)) {
                            const effectElement = document.createElement('div');
                            effectElement.className = 'option-effect';
                            
                            const resourceName = document.createElement('span');
                            switch(resource) {
                                case 'hunger': resourceName.textContent = '饥饿'; break;
                                case 'fatigue': resourceName.textContent = '疲劳'; break;
                                case 'dishonor': resourceName.textContent = '恶名'; break;
                                default: resourceName.textContent = resource;
                            }
                            effectElement.appendChild(resourceName);
                            
                            const effectValue = document.createElement('span');
                            if (damageValue > 0) {
                                // 显示对应数量的加号
                                effectValue.textContent = '+'.repeat(damageValue);
                                effectValue.className = 'effect-damage';
                            } else {
                                // 显示对应数量的减号
                                effectValue.textContent = '-'.repeat(Math.abs(damageValue));
                                effectValue.className = 'effect-remove';
                            }
                            effectElement.appendChild(effectValue);
                            
                            effectsContainer.appendChild(effectElement);
                        }
                    }
                }
                
                optionButton.appendChild(effectsContainer);
            }
            
            // 添加点击事件
            optionButton.addEventListener('click', () => {
                // 合并主活动和子选项的效果
                const combinedAction = {
                    name: `${action.name} - ${option.name}`,
                    description: typeof option.description === 'string' ? option.description : 
                                 Array.isArray(option.description) ? 
                                 option.description[Math.floor(Math.random() * option.description.length)] : 
                                 '',
                    actionType: 'special',
                    specialEffects: option.specialEffects || {},
                    damageTypes: option.damageTypes || {},
                    cardDescriptions: option.cardDescriptions || {},
                    cardDetailDescriptions: option.cardDetailDescriptions || {},
                    // 保存选中的选项引用，用于道具掉落和其他处理
                    selectedOption: option
                };
                
                // 执行合并后的活动
                performAction(combinedAction);
                closeSpecialActivityModal();
                closeModal();
            });
            
            // 添加到子选项容器
            optionsContainer.appendChild(optionButton);
        });
    } else {
        // 如果没有子选项，提供默认选项
        const defaultOption = document.createElement('div');
        defaultOption.className = 'special-option';
        defaultOption.textContent = '执行活动';
        defaultOption.addEventListener('click', () => {
            performAction(action);
            closeSpecialActivityModal();
            closeModal();
        });
        optionsContainer.appendChild(defaultOption);
    }
    
    // 显示子选项弹窗
    subModal.style.display = 'block';
}

// 关闭特殊活动子选项弹窗
function closeSpecialActivityModal() {
    const subModal = document.getElementById('special-activity-modal');
    if (subModal) {
        subModal.style.display = 'none';
    }
}

// 修改openLocationModal函数，更新特殊活动的点击事件
function openLocationModal(locationName, description, locationIndex) {
    gameState.currentLocationIndex = locationIndex;
    
    // 设置模态框内容
    document.getElementById('modal-title').textContent = locationName;
    document.getElementById('modal-description').textContent = description;
    
    // 获取该地点的可用行动
    const actions = config.locations[locationIndex].actions;
    
    // 创建行动按钮
    const actionsContainer = document.getElementById('modal-actions');
    actionsContainer.innerHTML = '';
    
    // 添加普通活动标题
    const normalActionsTitle = document.createElement('div');
    normalActionsTitle.className = 'actions-title';
    normalActionsTitle.textContent = '普通活动：';
    actionsContainer.appendChild(normalActionsTitle);
    
    // 创建普通行动卡片容器
    const normalCardsContainer = document.createElement('div');
    normalCardsContainer.className = 'cards-container';
    
    // 根据概率筛选可用活动
    const availableActions = actions.filter(action => {
        // 如果没有定义概率，默认100%显示
        if (!('probability' in action)) return true;
        
        // 随机数在0-100之间，如果小于等于概率值，则显示该活动
        return Math.random() * 100 <= action.probability;
    });
    
    const specialActions = availableActions.filter(action => action.actionType === 'special');
    let normalActions = availableActions.filter(action => action.actionType === 'normal');
    
    // 保险措施：如果没有任何普通活动可用，随机选择一个
    if (normalActions.length === 0) {
        // 获取该地点所有普通活动
        const allNormalActions = actions.filter(action => action.actionType === 'normal');
        
        // 如果有普通活动，随机选择一个
        if (allNormalActions.length > 0) {
            const randomIndex = Math.floor(Math.random() * allNormalActions.length);
            normalActions = [allNormalActions[randomIndex]];
            console.log('没有可用的普通活动，随机选择了一个：', allNormalActions[randomIndex].name);
        }
    }
    
    // 先创建普通活动卡片
    normalActions.forEach((action, index) => {
        // 创建行动卡片容器
        const actionCard = document.createElement('div');
        actionCard.className = 'action-card';
        
        // 添加行动名称
        const actionName = document.createElement('div');
        actionName.className = 'action-name';
        actionName.textContent = action.name;
        actionCard.appendChild(actionName);
        
        // 添加行动描述 - 处理可能的数组形式
        const actionDescription = document.createElement('div');
        actionDescription.className = 'action-description';
        
        // 如果描述是数组，随机选择一个
        if (Array.isArray(action.description)) {
            const randomIndex = Math.floor(Math.random() * action.description.length);
            actionDescription.textContent = action.description[randomIndex];
        } else {
            actionDescription.textContent = action.description;
        }
        
        actionCard.appendChild(actionDescription);
        
        // 添加效果信息
        const effectsContainer = document.createElement('div');
        effectsContainer.className = 'action-effects';
        
        // 遍历所有损耗类型
        let hasDamage = false;
        for (const [resource, damageValue] of Object.entries(action.damageTypes)) {
            if (damageValue !== 0 && ['hunger', 'fatigue', 'dishonor'].includes(resource)) {
                hasDamage = true;
                const effectElement = document.createElement('div');
                effectElement.className = 'action-effect';
                
                const resourceName = document.createElement('span');
                switch(resource) {
                    case 'hunger': resourceName.textContent = '饥饿'; break;
                    case 'fatigue': resourceName.textContent = '疲劳'; break;
                    case 'dishonor': resourceName.textContent = '恶名'; break;
                    default: resourceName.textContent = resource;
                }
                effectElement.appendChild(resourceName);
                
                const effectValue = document.createElement('span');
                if (damageValue > 0) {
                    // 显示对应数量的加号
                    effectValue.textContent = '+'.repeat(damageValue);
                    effectValue.className = 'effect-damage';
                } else {
                    // 显示对应数量的减号
                    effectValue.textContent = '-'.repeat(Math.abs(damageValue));
                    effectValue.className = 'effect-remove';
                }
                effectElement.appendChild(effectValue);
                
                effectsContainer.appendChild(effectElement);
            }
        }
        
        if (hasDamage) {
            actionCard.appendChild(effectsContainer);
        }
        
        // 添加执行按钮
        const executeButton = document.createElement('button');
        executeButton.className = 'execute-button';
        executeButton.textContent = '执行';
        executeButton.addEventListener('click', () => {
            performAction(action);
            closeModal();
        });
        
        actionCard.appendChild(executeButton);
        
        // 添加整个卡片的点击事件（除了点击按钮外）
        actionCard.addEventListener('click', (e) => {
            if (e.target !== executeButton && !executeButton.contains(e.target)) {
                performAction(action);
                closeModal();
            }
        });
        
        // 添加到普通活动容器
        normalCardsContainer.appendChild(actionCard);
    });
    
    actionsContainer.appendChild(normalCardsContainer);
    
    // 如果有特殊活动，添加特殊活动区域
    if (specialActions.length > 0) {
        // 添加特殊活动标题
        const specialActionsTitle = document.createElement('div');
        specialActionsTitle.className = 'actions-title special-actions-title';
        specialActionsTitle.textContent = '特殊活动：';
        actionsContainer.appendChild(specialActionsTitle);
        
        // 创建特殊行动卡片容器
        const specialCardsContainer = document.createElement('div');
        specialCardsContainer.className = 'cards-container special-cards-container';
        
        // 创建特殊活动卡片
        specialActions.forEach((action, index) => {
            // 创建行动卡片容器
            const actionCard = document.createElement('div');
            actionCard.className = 'action-card special-action-card';
            
            // 添加行动名称
            const actionName = document.createElement('div');
            actionName.className = 'action-name';
            actionName.textContent = action.name;
            actionCard.appendChild(actionName);
            
            // 添加行动描述 - 处理可能的数组形式
            const actionDescription = document.createElement('div');
            actionDescription.className = 'action-description';
            
            // 如果描述是数组，随机选择一个
            if (Array.isArray(action.description)) {
                const randomIndex = Math.floor(Math.random() * action.description.length);
                actionDescription.textContent = action.description[randomIndex];
            } else {
                actionDescription.textContent = action.description;
            }
            
            actionCard.appendChild(actionDescription);
            
            // 添加效果信息
            const effectsContainer = document.createElement('div');
            effectsContainer.className = 'action-effects';
            
            // 遍历所有特殊效果类型
            let hasEffect = false;
            
            // 检查特殊效果属性是否存在
            if (action.specialEffects) {
                for (const [resource, effectValue] of Object.entries(action.specialEffects)) {
                    if (effectValue !== 0 && ['clue', 'trace'].includes(resource)) {
                        hasEffect = true;
                        const effectElement = document.createElement('div');
                        effectElement.className = 'action-effect';
                        
                        // 显示资源名称
                        const resourceName = document.createElement('span');
                        switch(resource) {
                            case 'clue': resourceName.textContent = '线索'; break;
                            case 'trace': resourceName.textContent = '行踪'; break;
                            default: resourceName.textContent = resource;
                        }
                        effectElement.appendChild(resourceName);
                        
                        // 显示效果指示
                        const effectValue = document.createElement('span');
                        if (action.specialEffects[resource] > 0) {
                            // 显示对应数量的加号
                            effectValue.textContent = '+'.repeat(action.specialEffects[resource]);
                            effectValue.className = 'effect-special';
                        } else {
                            // 显示对应数量的减号
                            effectValue.textContent = '-'.repeat(Math.abs(action.specialEffects[resource]));
                            effectValue.className = 'effect-remove';
                        }
                        effectElement.appendChild(effectValue);
                        
                        effectsContainer.appendChild(effectElement);
                    }
                }
            }
            
            // 如果特殊活动也有基础资源损耗，显示这些效果
            if (action.damageTypes) {
                for (const [resource, damageValue] of Object.entries(action.damageTypes)) {
                    if (damageValue !== 0 && ['hunger', 'fatigue', 'dishonor'].includes(resource)) {
                        hasEffect = true;
                        const effectElement = document.createElement('div');
                        effectElement.className = 'action-effect';
                        
                        // 显示资源名称
                        const resourceName = document.createElement('span');
                        switch(resource) {
                            case 'hunger': resourceName.textContent = '饥饿'; break;
                            case 'fatigue': resourceName.textContent = '疲劳'; break;
                            case 'dishonor': resourceName.textContent = '恶名'; break;
                            default: resourceName.textContent = resource;
                        }
                        effectElement.appendChild(resourceName);
                        
                        // 显示损耗指示
                        const effectValue = document.createElement('span');
                        if (damageValue > 0) {
                            // 显示对应数量的加号
                            effectValue.textContent = '+'.repeat(damageValue);
                            effectValue.className = 'effect-damage';
                        } else {
                            // 显示对应数量的减号
                            effectValue.textContent = '-'.repeat(Math.abs(damageValue));
                            effectValue.className = 'effect-remove';
                        }
                        effectElement.appendChild(effectValue);
                        
                        effectsContainer.appendChild(effectElement);
                    }
                }
            }
            
            if (hasEffect) {
                actionCard.appendChild(effectsContainer);
            }
            
            // 添加执行按钮
            const executeButton = document.createElement('button');
            executeButton.className = 'execute-button special-execute-button';
            executeButton.textContent = '选择';
            executeButton.addEventListener('click', () => {
                // 打开特殊活动子选项弹窗，而不是直接执行
                openSpecialActivityModal(action);
            });
            
            actionCard.appendChild(executeButton);
            
            // 添加整个卡片的点击事件（除了点击按钮外）
            actionCard.addEventListener('click', (e) => {
                if (e.target !== executeButton && !executeButton.contains(e.target)) {
                    // 打开特殊活动子选项弹窗，而不是直接执行
                    openSpecialActivityModal(action);
                }
            });
            
            // 添加到特殊活动容器
            specialCardsContainer.appendChild(actionCard);
        });
        
        actionsContainer.appendChild(specialCardsContainer);
    }
    
    // 显示模态框
    document.getElementById('location-modal').style.display = 'block';
    gameState.modalVisible = true;
}

// 关闭模态框
function closeModal() {
    document.getElementById('location-modal').style.display = 'none';
    gameState.modalVisible = false;
}

// 随机抽取一张扑克牌，返回包含花色和数值的对象
function drawCard() {
    const cardValues = config.cards.values;
    const cardSuits = config.cards.suits;
    
    const randomValueIndex = Math.floor(Math.random() * cardValues.length);
    const randomSuitIndex = Math.floor(Math.random() * cardSuits.length);
    
    return {
        suit: cardSuits[randomSuitIndex],
        value: cardValues[randomValueIndex],
        name: config.cards.names[cardValues[randomValueIndex]],
        suitName: config.cards.suitNames[cardSuits[randomSuitIndex]]
    };
}

// 获取扑克牌的点数，根据当前牌堆总值优化选择
function getCardValue(card, currentTotal = 0) {
    // 如果是A，需要根据当前总点数选择1或11
    if (card.value === 'A') {
        // 如果加11后不会超过21，选11，否则选1
        if (currentTotal + 11 <= config.resourceLimits.max) {
            return 11;
        } else {
            return 1;
        }
    } else {
        return config.cards.points[card.value];
    }
}

// 计算一个牌堆中所有牌的最佳总点数（考虑A可以是1或11）
function calculateOptimalTotal(cards) {
    let total = 0;
    let aceCount = 0;
    
    // 先计算非A牌的点数
    for (const card of cards) {
        if (card.value === 'A') {
            aceCount++;
        } else {
            total += config.cards.points[card.value];
        }
    }
    
    // 处理A牌，尽量使用11但不超过21
    for (let i = 0; i < aceCount; i++) {
        if (total + 11 <= config.resourceLimits.max) {
            total += 11;
        } else {
            total += 1;
        }
    }
    
    return total;
}

// 执行选择的行动
function performAction(action) {
    // 更新当前位置
    const locationName = config.locations[gameState.currentLocationIndex].name;
    gameState.currentLocation = locationName;
    document.getElementById('current-location').textContent = `当前位置：${gameState.currentLocation}`;
    
    // 如果是首次访问，添加到已访问列表
    if (!gameState.visitedLocations.includes(locationName)) {
        gameState.visitedLocations.push(locationName);
    }
    
    // 对每种资源应用损耗效果
    const damageResults = {}; // 记录抽到的牌和结果
    
    // 记录触发的特殊效果
    const specialEffects = {
        exactly21: [], // 记录正好达到21点的牌堆
        busted: []    // 记录爆牌(>21)的牌堆
    };
    
    // 根据活动类型处理效果
    if (action.actionType === 'normal') {
        // 处理普通活动效果
        for (const [resource, damageValue] of Object.entries(action.damageTypes)) {
            if (damageValue !== 0) {
                // 如果是基础损耗类型
                if (['hunger', 'fatigue', 'dishonor'].includes(resource)) {
                    if (damageValue > 0) {
                        // 正数：抽取指定数量的牌
                        for (let i = 0; i < damageValue; i++) {
                            // 抽取一张扑克牌
                            const card = drawCard();
                            
                            // 添加牌到牌堆，传递整个活动对象
                            addCardToPile(resource, card, action);
                            
                            // 计算牌堆总值
                            const total = calculateOptimalTotal(gameState.cards[resource]);
                            
                            // 记录结果 (只记录最后一张牌的结果)
                            if (i === damageValue - 1) {
                                damageResults[resource] = { 
                                    card: card, 
                                    value: total, 
                                    previousValue: gameState.resources[resource],
                                    count: damageValue
                                };
                            }
                            
                            // 检查牌堆总值
                            if (total > config.resourceLimits.max) {
                                // 爆牌 - 超过21点
                                specialEffects.busted.push(resource);
                                
                                // 清空牌堆
                                clearCardPile(resource);
                                
                                // 重置资源值为0
                                gameState.resources[resource] = 0;
                                
                                // 爆牌后不再继续抽牌
                                break;
                            } 
                            else if (Math.abs(total - config.resourceLimits.max) < 0.01) {
                                // 正好21点
                                specialEffects.exactly21.push(resource);
                                
                                // 清空牌堆
                                clearCardPile(resource);
                                
                                // 重置资源值为0
                                gameState.resources[resource] = 0;
                                
                                // 达到21点后不再继续抽牌
                                break;
                            }
                            else {
                                // 正常情况，更新资源值
                                gameState.resources[resource] = total;
                            }
                        }
                    } else {
                        // 负数：移除指定数量的牌
                        const removeCount = Math.min(Math.abs(damageValue), gameState.cards[resource].length);
                        
                        if (removeCount > 0) {
                            // 记录移除前的值
                            const previousValue = gameState.resources[resource];
                            
                            // 移除最近添加的牌（从牌堆顶部）
                            for (let i = 0; i < removeCount; i++) {
                                if (gameState.cards[resource].length > 0) {
                                    // 移除牌堆中最后一张牌
                                    gameState.cards[resource].pop();
                                    
                                    // 移除对应的DOM元素
                                    const lastCard = gameState.cardPiles[resource].lastElementChild;
                                    if (lastCard) {
                                        gameState.cardPiles[resource].removeChild(lastCard);
                                    }
                                }
                            }
                            
                            // 重新计算牌堆总值
                            const total = calculateOptimalTotal(gameState.cards[resource]);
                            
                            // 更新资源值
                            gameState.resources[resource] = total;
                            
                            // 记录结果
                            damageResults[resource] = { 
                                value: total, 
                                previousValue: previousValue,
                                count: damageValue, // 负值表示移除的数量
                                removeCount: removeCount
                            };
                        }
                    }
                }
            }
        }
    } else if (action.actionType === 'special') {
        // 处理特殊活动效果
        // 特殊活动直接作用于线索和行踪
        if (action.specialEffects) {
            for (const [resource, effectValue] of Object.entries(action.specialEffects)) {
                if (effectValue !== 0 && ['clue', 'trace'].includes(resource)) {
                    if (effectValue > 0) {
                        // 正数：抽取指定数量的牌
                        for (let i = 0; i < effectValue; i++) {
                            // 抽取一张扑克牌
                            const card = drawCard();
                            
                            // 添加牌到指定牌堆，使用活动中的描述
                            addCardToPile(resource, card, action);
                            
                            // 计算牌堆总值
                            const total = calculateOptimalTotal(gameState.cards[resource]);
                            
                            // 记录结果 (只记录最后一张牌的结果)
                            if (i === effectValue - 1) {
                                damageResults[resource] = { 
                                    card: card, 
                                    value: total, 
                                    previousValue: gameState.resources[resource],
                                    count: effectValue
                                };
                            }
                            
                            // 检查牌堆总值
                            if (total > config.resourceLimits.max) {
                                // 爆牌 - 超过21点
                                specialEffects.busted.push(resource);
                                
                                // 清空牌堆
                                clearCardPile(resource);
                                
                                // 重置资源值为0
                                gameState.resources[resource] = 0;
                                
                                // 爆牌后不再继续抽牌
                                break;
                            } 
                            else if (Math.abs(total - config.resourceLimits.max) < 0.01) {
                                // 正好21点
                                specialEffects.exactly21.push(resource);
                                
                                // 清空牌堆
                                clearCardPile(resource);
                                
                                // 重置资源值为0
                                gameState.resources[resource] = 0;
                                
                                // 达到21点后不再继续抽牌
                                break;
                            }
                            else {
                                // 正常情况，更新资源值
                                gameState.resources[resource] = total;
                            }
                        }
                    } else {
                        // 负数：移除指定数量的牌
                        const removeCount = Math.min(Math.abs(effectValue), gameState.cards[resource].length);
                        
                        if (removeCount > 0) {
                            // 记录移除前的值
                            const previousValue = gameState.resources[resource];
                            
                            // 移除最近添加的牌（从牌堆顶部）
                            for (let i = 0; i < removeCount; i++) {
                                if (gameState.cards[resource].length > 0) {
                                    // 移除牌堆中最后一张牌
                                    gameState.cards[resource].pop();
                                    
                                    // 移除对应的DOM元素
                                    const lastCard = gameState.cardPiles[resource].lastElementChild;
                                    if (lastCard) {
                                        gameState.cardPiles[resource].removeChild(lastCard);
                                    }
                                }
                            }
                            
                            // 重新计算牌堆总值
                            const total = calculateOptimalTotal(gameState.cards[resource]);
                            
                            // 更新资源值
                            gameState.resources[resource] = total;
                            
                            // 记录结果
                            damageResults[resource] = { 
                                value: total, 
                                previousValue: previousValue,
                                count: effectValue, // 负值表示移除的数量
                                removeCount: removeCount
                            };
                        }
                    }
                }
            }
        }
        
        // 处理特殊活动对基础资源的影响（如果有）
        if (action.damageTypes) {
            for (const [resource, damageValue] of Object.entries(action.damageTypes)) {
                if (damageValue !== 0 && ['hunger', 'fatigue', 'dishonor'].includes(resource)) {
                    if (damageValue > 0) {
                        // 正数：抽取指定数量的牌
                        for (let i = 0; i < damageValue; i++) {
                            // 抽取一张扑克牌
                            const card = drawCard();
                            
                            // 添加牌到牌堆，传递整个活动对象
                            addCardToPile(resource, card, action);
                            
                            // 计算牌堆总值
                            const total = calculateOptimalTotal(gameState.cards[resource]);
                            
                            // 记录结果 (只记录最后一张牌的结果)
                            if (i === damageValue - 1) {
                                damageResults[resource] = { 
                                    card: card, 
                                    value: total, 
                                    previousValue: gameState.resources[resource],
                                    count: damageValue
                                };
                            }
                            
                            // 检查牌堆总值
                            if (total > config.resourceLimits.max) {
                                // 爆牌 - 超过21点
                                specialEffects.busted.push(resource);
                                
                                // 清空牌堆
                                clearCardPile(resource);
                                
                                // 重置资源值为0
                                gameState.resources[resource] = 0;
                                
                                // 爆牌后不再继续抽牌
                                break;
                            } 
                            else if (Math.abs(total - config.resourceLimits.max) < 0.01) {
                                // 正好21点
                                specialEffects.exactly21.push(resource);
                                
                                // 清空牌堆
                                clearCardPile(resource);
                                
                                // 重置资源值为0
                                gameState.resources[resource] = 0;
                                
                                // 达到21点后不再继续抽牌
                                break;
                            }
                            else {
                                // 正常情况，更新资源值
                                gameState.resources[resource] = total;
                            }
                        }
                    } else {
                        // 负数：移除指定数量的牌
                        const removeCount = Math.min(Math.abs(damageValue), gameState.cards[resource].length);
                        
                        if (removeCount > 0) {
                            // 记录移除前的值
                            const previousValue = gameState.resources[resource];
                            
                            // 移除最近添加的牌（从牌堆顶部）
                            for (let i = 0; i < removeCount; i++) {
                                if (gameState.cards[resource].length > 0) {
                                    // 移除牌堆中最后一张牌
                                    gameState.cards[resource].pop();
                                    
                                    // 移除对应的DOM元素
                                    const lastCard = gameState.cardPiles[resource].lastElementChild;
                                    if (lastCard) {
                                        gameState.cardPiles[resource].removeChild(lastCard);
                                    }
                                }
                            }
                            
                            // 重新计算牌堆总值
                            const total = calculateOptimalTotal(gameState.cards[resource]);
                            
                            // 更新资源值
                            gameState.resources[resource] = total;
                            
                            // 记录结果
                            damageResults[resource] = { 
                                value: total, 
                                previousValue: previousValue,
                                count: damageValue, // 负值表示移除的数量
                                removeCount: removeCount
                            };
                        }
                    }
                }
            }
        }
    }
    
    // 处理基础资源触发的特殊效果
    // 如果有牌堆正好达到21点，为每个都触发线索牌堆抽牌
    if (specialEffects.exactly21.length > 0) {
        // 遍历所有21点的资源，分别处理
        specialEffects.exactly21.forEach(triggerResource => {
            const card = drawCard();
            const triggerKey = `${triggerResource}21`;
            
            // 从配置中获取描述
            const descriptionText = getLocationSpecialDescriptions('clue', triggerKey);
            const detailDescriptionText = getLocationSpecialDescriptions('clue', triggerKey, true);
            
            // 创建包含详细描述的对象
            const descriptionObj = {
                name: descriptionText,
                description: detailDescriptionText || `因${getResourceDisplayName(triggerResource)}得分达到21点而获得的重要线索`
            };
            
            // 添加牌到线索牌堆，传递描述对象
            addCardToPile('clue', card, descriptionObj);
            
            // 计算新的线索总值
            const clueTotal = calculateOptimalTotal(gameState.cards.clue);
            
            // 更新线索值
            gameState.resources.clue = clueTotal;
            
            // 为每个触发添加独立的记录
            const resultKey = `clue_${triggerResource}`;
            damageResults[resultKey] = { 
                resource: 'clue',
                card: card, 
                value: clueTotal,
                previousValue: clueTotal - getCardValue(card, clueTotal - getCardValue(card, 0)),
                trigger: `${getResourceDisplayName(triggerResource)}正好达到21点` 
            };
        });
    }
    
    // 如果有牌堆爆牌，为每个都触发行踪牌堆抽牌
    if (specialEffects.busted.length > 0) {
        // 遍历所有爆牌的资源，分别处理
        specialEffects.busted.forEach(triggerResource => {
            const card = drawCard();
            const triggerKey = `${triggerResource}Bust`;
            
            // 从配置中获取描述
            const descriptionText = getLocationSpecialDescriptions('trace', triggerKey);
            const detailDescriptionText = getLocationSpecialDescriptions('trace', triggerKey, true);
            
            // 创建包含详细描述的对象
            const descriptionObj = {
                name: descriptionText,
                description: detailDescriptionText || `因${getResourceDisplayName(triggerResource)}超过21点而暴露的行踪`
            };
            
            // 添加牌到行踪牌堆，传递描述对象
            addCardToPile('trace', card, descriptionObj);
            
            // 计算新的行踪总值
            const traceTotal = calculateOptimalTotal(gameState.cards.trace);
            
            // 更新行踪值
            gameState.resources.trace = traceTotal;
            
            // 为每个触发添加独立的记录
            const resultKey = `trace_${triggerResource}`;
            damageResults[resultKey] = { 
                resource: 'trace',
                card: card, 
                value: traceTotal,
                previousValue: traceTotal - getCardValue(card, traceTotal - getCardValue(card, 0)),
                trigger: `${getResourceDisplayName(triggerResource)}超过21点` 
            };
        });
    }
    
    // 处理道具掉落 - 根据itemDrops配置随机获得道具
    let itemDrops = null;
    
    // 确定使用哪个itemDrops配置
    if (action.actionType === 'normal') {
        // 普通活动使用活动自身的itemDrops
        itemDrops = action.itemDrops;
    } else if (action.actionType === 'special') {
        // 特殊活动使用选项的itemDrops
        itemDrops = action.selectedOption ? action.selectedOption.itemDrops : null;
    }
    
    if (itemDrops && itemDrops.length > 0) {
        // 计算总权重
        const totalWeight = itemDrops.reduce((sum, item) => sum + item.weight, 0);
        
        // 生成一个随机值
        const randomValue = Math.floor(Math.random() * totalWeight);
        
        // 根据权重确定获得的道具
        let currentWeight = 0;
        let selectedItemId = 'nothing';
        
        for (const itemDrop of itemDrops) {
            currentWeight += itemDrop.weight;
            if (randomValue < currentWeight) {
                selectedItemId = itemDrop.id;
                break;
            }
        }
        
        // 如果不是"nothing"，添加道具到背包
        if (selectedItemId !== 'nothing') {
            // 查找道具数据
            const itemData = config.items.find(item => item.id === selectedItemId);
            if (itemData) {
                // 创建道具实例并添加到背包
                const newItem = { ...itemData, id: itemData.id + '_' + Date.now() }; // 添加时间戳确保ID唯一
                addItemToInventory(newItem);
                
                // 显示获得道具的通知
                const activityName = action.actionType === 'special' && action.selectedOption 
                    ? action.selectedOption.name 
                    : action.name;
                
                notificationManager.item(`获得道具：<span class="notification-highlight">${itemData.name}</span>`, {
                    position: 'bottom-right'
                });
            }
        }
    }
    
    // 更新UI
    updateResourceBars();
    
    // 清空现有目的地并生成新的
    gameState.availableDestinations = [];
    generateAvailableDestinations();
    
    // 刷新可用地点列表
    displayAvailableLocations();
    
    // 显示动作结果提示，包括抽到的扑克牌
    showActionFeedback(action, damageResults, specialEffects);
}

// 向牌堆添加卡牌
function addCardToPile(resource, card, actionData) {
    // 将卡牌添加到游戏状态
    gameState.cards[resource].push(card);
    
    // 创建卡牌元素
    const cardElement = document.createElement('div');
    cardElement.className = 'playing-card';
    
    // 根据花色设置卡牌颜色
    if (['♥', '♦'].includes(card.suit)) {
        cardElement.classList.add('red');
    } else {
        cardElement.classList.add('black');
    }
    
    // 创建牌面元素 - 右上角小标记显示花色和点数
    const cardValueElement = document.createElement('div');
    cardValueElement.className = 'card-value';
    cardValueElement.innerHTML = `${card.value}<span class="card-suit">${card.suit}</span>`;
    cardElement.appendChild(cardValueElement);
    
    // 创建牌面名称元素
    const cardNameElement = document.createElement('div');
    cardNameElement.className = 'card-name';
    
    // 获取卡片名称 - 使用活动提供的描述作为卡片名称
    let cardName = '';
    let cardDetailDesc = ''; // 新增：详细描述
    
    if (actionData) {
        if (typeof actionData === 'string') {
            // 如果actionData是字符串，直接用作卡片名称
            cardName = actionData;
        } else if (typeof actionData === 'object') {
            // 检查是否是测试卡片对象
            if (actionData.name && actionData.description) {
                // 先检查是否有cardDescriptions和cardDetailDescriptions
                if (actionData.cardDescriptions && actionData.cardDescriptions[resource]) {
                    // 处理卡片名称 - 可能是字符串或数组
                    const nameSource = actionData.cardDescriptions[resource];
                    if (Array.isArray(nameSource)) {
                        // 从数组中随机选择一个
                        cardName = nameSource[Math.floor(Math.random() * nameSource.length)];
                    } else {
                        cardName = nameSource;
                    }
                    
                    // 处理详细描述
                    if (actionData.cardDetailDescriptions && actionData.cardDetailDescriptions[resource]) {
                        const descSource = actionData.cardDetailDescriptions[resource];
                        if (Array.isArray(descSource)) {
                            cardDetailDesc = descSource[Math.floor(Math.random() * descSource.length)];
                        } else {
                            cardDetailDesc = descSource;
                        }
                    }
                } 
                // 如果没有cardDescriptions，则使用name和description
                else {
                    // 处理名称 - 可能是字符串或数组
                    if (Array.isArray(actionData.name)) {
                        cardName = actionData.name[Math.floor(Math.random() * actionData.name.length)];
                    } else {
                        cardName = actionData.name;
                    }
                    
                    // 处理描述 - 可能是字符串或数组
                    if (Array.isArray(actionData.description)) {
                        cardDetailDesc = actionData.description[Math.floor(Math.random() * actionData.description.length)];
                    } else {
                        cardDetailDesc = actionData.description;
                    }
                }
            } 
            // 检查活动配置的卡片描述
            else if (actionData.cardDescriptions && actionData.cardDescriptions[resource]) {
                // 处理卡片名称 - 可能是字符串或数组
                const nameSource = actionData.cardDescriptions[resource];
                if (Array.isArray(nameSource)) {
                    // 从数组中随机选择一个
                    cardName = nameSource[Math.floor(Math.random() * nameSource.length)];
                } else {
                    cardName = nameSource;
                }
                
                // 在 location.js 中定义了 cardDetailDescriptions 则读取
                if (actionData.cardDetailDescriptions && actionData.cardDetailDescriptions[resource]) {
                    // 处理详细描述 - 可能是字符串或数组
                    const descSource = actionData.cardDetailDescriptions[resource];
                    if (Array.isArray(descSource)) {
                        // 从数组中随机选择一个
                        cardDetailDesc = descSource[Math.floor(Math.random() * descSource.length)];
                    } else {
                        cardDetailDesc = descSource;
                    }
                }
            }
        }
    }
    
    // 如果没有获取到名称，设置一个默认值
    if (!cardName) {
        cardName = getDefaultCardDescription(resource);
    }
    
    cardNameElement.textContent = cardName;
    cardElement.appendChild(cardNameElement);
    
    // 创建描述元素 - 可以用作额外说明
    const cardDescElement = document.createElement('div');
    cardDescElement.className = 'card-desc';
    
    // 设置详细描述
    cardDescElement.textContent = cardDetailDesc || ""; // 使用获取到的详细描述或留空
    cardElement.appendChild(cardDescElement);
    
    // 如果是线索牌堆，添加点击事件和选择功能
    if (resource === 'clue') {
        const cardIndex = gameState.cards.clue.length - 1; // 当前卡牌的索引
        
        // 储存DOM元素引用
        gameState.clueSelection.cardElements.push(cardElement);
        
        // 添加点击事件
        cardElement.addEventListener('click', () => {
            toggleClueCardSelection(cardIndex);
        });
        
        // 添加可点击的样式
        cardElement.classList.add('selectable');
    }
    
    // 添加到牌堆
    gameState.cardPiles[resource].appendChild(cardElement);
    
    // 滚动到最新添加的牌
    gameState.cardPiles[resource].scrollTop = gameState.cardPiles[resource].scrollHeight;
    
    // 如果是行踪牌堆，检查是否达到21点或爆牌
    if (resource === 'trace') {
        // 计算牌堆点数
        const total = calculateOptimalTotal(gameState.cards.trace);
        
        // 更新资源值
        gameState.resources.trace = total;
        
        // 保存当前卡片信息以供后续使用
        const currentCard = card;
        const cardDisplayName = cardName;
        
        // 检查是否正好21点
        if (Math.abs(total - config.resourceLimits.max) < 0.01) {
            // 正好21点，清空牌堆
            // 使用一个函数封装操作，避免多重嵌套的setTimeout
            const processTwentyOne = () => {
                clearCardPile('trace');
                gameState.resources.trace = 0;
                updateResourceBars();
                
                // 显示提示 - 使用新通知系统
                notificationManager.success(`行踪达到21点，获得【${cardDisplayName}】，牌堆已清空！`, {
                    resourceType: 'trace',
                    position: 'top',
                    duration: 5000
                });
            };
            
            // 延迟处理，给用户时间看到卡片
            setTimeout(processTwentyOne, 1500);
        }
        // 检查是否爆牌
        else if (total > config.resourceLimits.max) {
            // 爆牌，增加被动遭遇
            // 使用一个函数封装操作，避免多重嵌套的setTimeout
            const processBust = () => {
                addPassiveEncounter(1);
                clearCardPile('trace');
                gameState.resources.trace = 0;
                updateResourceBars();
                
                // 显示提示 - 使用新通知系统
                notificationManager.error(`行踪超过21点，获得【${cardDisplayName}】，被发现！被动遭遇+1，牌堆已清空`, {
                    resourceType: 'trace',
                    position: 'top',
                    duration: 5000
                });
            };
            
            // 延迟处理，给用户时间看到卡片
            setTimeout(processBust, 1500);
        }
    }
}

// 获取默认卡牌描述
function getDefaultCardDescription(resource) {
    switch(resource) {
        case 'hunger': return '食物消耗';
        case 'fatigue': return '体力消耗';
        case 'dishonor': return '名誉损失';
        case 'clue': return '找到重要线索';
        case 'trace': return '行踪被发现';
        default: return '未知效果';
    }
}

// 显示行动反馈
function showActionFeedback(action, damageResults, specialEffects) {
    // 构建反馈信息
    let messages = [];
    
    // 对每种资源处理反馈
    for (const [resource, result] of Object.entries(damageResults)) {
        // 如果是特殊触发资源，单独处理
        if (resource.includes('_')) {
            // 例如 clue_hunger 表示由hunger触发的clue抽牌
            const [actualResource, triggerResource] = resource.split('_');
            
            if (result.trigger) {
                messages.push(`${result.trigger}，获得【${getResourceDisplayName(actualResource)}】牌`);
            }
            continue;
        }
        
        // 处理普通资源反馈
        if (result) {
            // 如果是负数，表示移除牌
            if (result.count < 0) {
                const removeCount = result.removeCount || Math.abs(result.count);
                if (removeCount > 0) {
                    messages.push(`移除了${removeCount}张【${getResourceDisplayName(resource)}】牌`);
                }
            } 
            // 如果是正数，表示抽取牌
            else if (result.count > 0) {
                if (result.count === 1) {
                    // 单张抽牌显示具体卡牌信息
                    messages.push(`抽取了【${getResourceDisplayName(resource)}】牌: ${result.card.suitName}${result.card.name}`);
                } else {
                    // 多张抽牌简化显示
                    messages.push(`抽取了${result.count}张【${getResourceDisplayName(resource)}】牌`);
                }
            }
        }
    }
    
    // 添加特殊效果消息
    if (specialEffects.exactly21.length > 0) {
        for (const resource of specialEffects.exactly21) {
            messages.push(`【${getResourceDisplayName(resource)}】达到21点，牌堆已清空`);
        }
    }
    
    if (specialEffects.busted.length > 0) {
        for (const resource of specialEffects.busted) {
            messages.push(`【${getResourceDisplayName(resource)}】超过21点，牌堆已清空`);
        }
    }
    
    // 使用辅助函数显示消息队列
    if (messages.length > 0) {
        showMessageQueue(messages);
    }
    
    // 更新资源条
    updateResourceBars();
}

// 显示消息队列
function showMessageQueue(messages) {
    if (!messages || messages.length === 0) return;
    
    // 消息索引
    let currentIndex = 0;
    const messageCount = messages.length;
    
    // 显示下一条消息
    const showNextMessage = (index) => {
        if (index < messageCount) {
            // 使用通知管理器显示消息
            notificationManager.info(messages[index], {
                position: 'top',
                duration: 3000,
                type: 'temp',
                onClose: () => {
                    // 消息关闭后，延迟显示下一条
                    setTimeout(() => {
                        showNextMessage(index + 1);
                    }, 300);
                }
            });
        }
    };
    
    // 开始显示第一条消息
    showNextMessage(currentIndex);
}

// 增加损耗值
function addDamage(resourceType, amount) {
    // 计算新的资源值，确保在限制范围内
    const newValue = Math.min(
        config.resourceLimits.max,
        gameState.resources[resourceType] + amount
    );
    
    // 更新资源值
    gameState.resources[resourceType] = newValue;
    
    // 更新UI
    updateResourceBars();
}

// 更新资源条
function updateResourceBars() {
    const maxLimit = config.resourceLimits.max;
    
    // 更新饥饿
    const hungerPercent = (gameState.resources.hunger / maxLimit) * 100;
    const hungerWidth = `${hungerPercent}%`;
    gameState.resourceBars.hunger.style.width = hungerWidth;
    gameState.resourceValues.hunger.textContent = Math.floor(gameState.resources.hunger);
    
    // 更新疲劳
    const fatiguePercent = (gameState.resources.fatigue / maxLimit) * 100;
    const fatigueWidth = `${fatiguePercent}%`;
    gameState.resourceBars.fatigue.style.width = fatigueWidth;
    gameState.resourceValues.fatigue.textContent = Math.floor(gameState.resources.fatigue);
    
    // 更新恶名
    const dishonorPercent = (gameState.resources.dishonor / maxLimit) * 100;
    const dishonorWidth = `${dishonorPercent}%`;
    gameState.resourceBars.dishonor.style.width = dishonorWidth;
    gameState.resourceValues.dishonor.textContent = Math.floor(gameState.resources.dishonor);
    
    // 更新线索
    const cluePercent = (gameState.resources.clue / maxLimit) * 100;
    const clueWidth = `${cluePercent}%`;
    gameState.resourceBars.clue.style.width = clueWidth;
    gameState.resourceValues.clue.textContent = Math.floor(gameState.resources.clue);
    
    // 更新行踪
    const tracePercent = (gameState.resources.trace / maxLimit) * 100;
    const traceWidth = `${tracePercent}%`;
    gameState.resourceBars.trace.style.width = traceWidth;
    gameState.resourceValues.trace.textContent = Math.floor(gameState.resources.trace);
}

// 清空牌堆
function clearCardPile(resource) {
    // 清空游戏状态中的牌堆记录
    gameState.cards[resource] = [];
    
    // 清空DOM中的牌堆元素
    const pile = gameState.cardPiles[resource];
    
    // 移除所有牌元素，但保留其他元素（例如线索牌堆中的计数器）
    const cardElements = pile.querySelectorAll('.playing-card');
    cardElements.forEach(element => {
        pile.removeChild(element);
    });
    
    // 添加清空提示
    const emptyIndicator = document.createElement('div');
    emptyIndicator.className = 'pile-cleared';
    emptyIndicator.textContent = '牌堆已清空';
    pile.appendChild(emptyIndicator);
    
    // 4秒后移除提示
    setTimeout(() => {
        if (pile.contains(emptyIndicator)) {
            pile.removeChild(emptyIndicator);
        }
    }, 4000);
    
    // 如果是线索牌堆，清空选择状态
    if (resource === 'clue') {
        gameState.clueSelection.selectedCards = [];
        gameState.clueSelection.cardElements = [];
        
        // 重置计数器显示
        const counterValue = document.querySelector('#clue-selection-counter .counter-value');
        if (counterValue) {
            counterValue.textContent = '0';
            counterValue.className = 'counter-value';
        }
    }
}

// 获取当前地点的特殊卡牌描述
function getLocationSpecialDescriptions(type, key, isDetailDescription = false) {
    // 检查是否在有效地点
    if (gameState.currentLocationIndex >= 0 && gameState.currentLocationIndex < config.locations.length) {
        const location = config.locations[gameState.currentLocationIndex];
        
        // 根据是否需要详细描述选择不同的对象
        if (isDetailDescription && location.specialCardDetailDescriptions && location.specialCardDetailDescriptions[type]) {
            const description = location.specialCardDetailDescriptions[type][key] || 
                   location.specialCardDetailDescriptions[type].default;
                   
            // 如果描述是数组，随机选择一个
            if (Array.isArray(description)) {
                return description[Math.floor(Math.random() * description.length)];
            }
            
            return description;
        } 
        else if (!isDetailDescription && location.specialCardDescriptions && location.specialCardDescriptions[type]) {
            const description = location.specialCardDescriptions[type][key] || 
                   location.specialCardDescriptions[type].default;
                   
            // 如果描述是数组，随机选择一个
            if (Array.isArray(description)) {
                return description[Math.floor(Math.random() * description.length)];
            }
            
            return description;
        }
    }
    
    // 如果不在有效地点或没有找到描述，返回默认值
    const defaults = {
        clue: {
            hunger21: ['食物来源的线索', '可食用资源情报', '食物相关的重要发现', '饮食习惯的信息'],
            fatigue21: ['休息地点的线索', '安全住所的信息', '避风港的位置', '适合休息的场所'],
            dishonor21: ['身份隐藏的线索', '声誉相关的情报', '他人对你的评价', '社会关系的信息'],
            default: ['重要发现的线索', '关键情报', '有价值的信息', '隐藏的秘密']
        },
        trace: {
            hungerBust: ['觅食留下的痕迹', '寻找食物的行踪', '饥饿导致的疏忽', '为食物冒险的后果'],
            fatigueBust: ['行动迟缓被发现', '疲惫导致的失误', '体力不支的表现', '休息时的疏忽大意'],
            dishonorBust: ['恶名传播过广', '不良名声的影响', '名声败坏的结果', '因恶名而被识破'],
            default: ['行踪被发现', '留下的痕迹', '可追踪的线索', '暴露的位置']
        }
    };
    
    // 详细描述的默认值
    const defaultDetailDescs = {
        clue: {
            hunger21: ['你发现了关于食物来源的重要线索，这可能对你的生存至关重要', '这份食物储备的信息告诉你哪里可以安全获取资源', '这个食谱秘密可以帮助你在荒野中辨认安全的食物', '你了解到食物贸易的路线和时间，这将帮助你避开危险'],
            fatigue21: ['这个安全住所的情报对你的休息至关重要', '这个舒适的休息地点可以让你恢复体力并避开危险', '这个避风港的位置信息可以在你需要时提供庇护', '这个隐蔽的藏身处正好位于巡逻路线的盲区'],
            dishonor21: ['你了解到自己在当地的声誉情况，这有助于调整你的策略', '你的事迹在当地流传的方式可能影响你未来的行动', '村民对你的复杂看法包含了对你过去行为的评价', '从私下议论中，你获得了关于自己声誉的重要情报'],
            default: ['这个重要信息可能对你的生存有关键作用', '这条隐藏的消息透露了一些有价值的情报', '你发现了一个鲜为人知的秘密，或许能派上用场', '这条情报包含了一个可能对你有用的隐藏信息']
        },
        trace: {
            hungerBust: ['你在寻找食物时不够谨慎，留下了明显的痕迹可能被追踪', '村民看到你翻找食物的行为，你的形象已经被记住', '偷取食物的行为留下了证据，增加了你被追踪的可能', '饥饿使你变得不够谨慎，你的行踪已经暴露'],
            fatigueBust: ['疲惫使你的行为变得迟缓，引起了不必要的注意', '因为体力不支，你的失误引起了村民的怀疑', '极度疲劳使你难以维持警惕，破绽已经暴露', '你的异常举动因疲劳而变得明显，引起了人们的注意'],
            dishonorBust: ['你的恶名已经在这里广为人知，很难再隐藏自己', '关于你的不良传闻已经传开，使你更容易被认出', '村民们谈论着你的行为，这让你更难以隐藏身份', '你的名声已经成为你的弱点，增加了被发现的风险'],
            default: ['你的行踪已经暴露，需要更加小心谨慎', '这些留下的痕迹可能会引导追踪者找到你', '这些明显的线索增加了你被发现的风险', '你的位置已经不再是秘密，需要迅速转移']
        }
    };
    
    // 根据是否需要详细描述返回相应的默认值
    if (isDetailDescription) {
        const defaultDetailDesc = defaultDetailDescs[type][key] || defaultDetailDescs[type].default;
        
        // 如果详细描述是数组，随机选择一个
        if (Array.isArray(defaultDetailDesc)) {
            return defaultDetailDesc[Math.floor(Math.random() * defaultDetailDesc.length)];
        }
        
        return defaultDetailDesc;
    } else {
        const defaultDesc = defaults[type][key] || defaults[type].default;
        
        // 如果默认描述是数组，随机选择一个
        if (Array.isArray(defaultDesc)) {
            return defaultDesc[Math.floor(Math.random() * defaultDesc.length)];
        }
        
        return defaultDesc;
    }
}

// 更新遭遇计分显示
function updateEncounterScores() {
    gameState.encounterElements.active.textContent = gameState.encounters.active;
    gameState.encounterElements.passive.textContent = gameState.encounters.passive;
}

// 增加主动遭遇计数
function addActiveEncounter(count = 1) {
    gameState.encounters.active += count;
    updateEncounterScores();
}

// 增加被动遭遇计数
function addPassiveEncounter(count = 1) {
    gameState.encounters.passive += count;
    updateEncounterScores();
}

// 显示临时通知
function showNotification(message, className) {
    // 确保消息内容是字符串
    message = message || '';
    
    // 统一使用NotificationManager显示通知
    const options = { position: 'top', duration: 5000 };
    
    // 根据不同的类名设置不同的通知类型
    switch(className) {
        case 'trace-21':
            options.resourceType = 'trace';
            return notificationManager.success(message, options);
        case 'trace-bust':
            options.resourceType = 'trace';
            return notificationManager.error(message, options);
        case 'clue-21-combo':
            options.resourceType = 'clue';
            return notificationManager.success(message, options);
        default:
            // 其它通知类型
            message = `<span class="notification-highlight">${message}</span>`;
            return notificationManager.notify({
                message,
                position: 'top',
                type: 'info',
                ...options
            });
    }
}

// 切换线索牌的选择状态
function toggleClueCardSelection(cardIndex) {
    // 查找索引在选中列表中的位置
    const selectionIndex = gameState.clueSelection.selectedCards.indexOf(cardIndex);
    
    // 获取卡牌元素
    const cardElement = gameState.clueSelection.cardElements[cardIndex];
    
    // 如果已经选中，取消选中
    if (selectionIndex !== -1) {
        gameState.clueSelection.selectedCards.splice(selectionIndex, 1);
        if (cardElement) cardElement.classList.remove('selected');
    } 
    // 否则添加到选中列表
    else {
        gameState.clueSelection.selectedCards.push(cardIndex);
        if (cardElement) cardElement.classList.add('selected');
    }
    
    // 检查当前选中卡牌的总值
    checkSelectedClueCardsValue();
}

// 检查已选中线索卡牌的总值
function checkSelectedClueCardsValue() {
    // 获取所有选中的索引
    const selectedCardIndices = gameState.clueSelection.selectedCards;
    
    // 获取计数器元素
    const counterValue = document.querySelector('#clue-selection-counter .counter-value');
    
    // 如果没有选中牌，显示0并返回
    if (selectedCardIndices.length === 0) {
        if (counterValue) counterValue.textContent = '0';
        return;
    }
    
    // 获取选中的卡牌值
    const selectedCards = selectedCardIndices.map(index => gameState.cards.clue[index]);
    
    // 计算总值
    const totalValue = calculateOptimalTotal(selectedCards);
    
    // 更新计数器显示
    if (counterValue) {
        counterValue.textContent = Math.floor(totalValue);
        
        // 根据总值设置样式
        counterValue.className = 'counter-value';
        if (totalValue > config.resourceLimits.max) {
            counterValue.classList.add('over-limit');
        } else if (Math.abs(totalValue - config.resourceLimits.max) < 0.01) {
            counterValue.classList.add('exactly-21');
        }
    }
    
    // 如果正好21点，增加主动遭遇计数
    if (Math.abs(totalValue - config.resourceLimits.max) < 0.01) {
        // 增加主动遭遇
        addActiveEncounter(1);
        
        // 使用新通知系统显示提示
        notificationManager.success(`发现关键线索组合！主动遭遇+1`, {
            resourceType: 'clue',
            position: 'top',
            duration: 4000
        });
        
        // 闪烁所选卡牌
        flashSelectedClueCards();
        
        // 删除选中的牌
        setTimeout(() => {
            removeSelectedClueCards();
        }, 1500);
    }
}

// 删除选中的线索牌
function removeSelectedClueCards() {
    // 如果没有选中的牌，直接返回
    if (gameState.clueSelection.selectedCards.length === 0) {
        return;
    }

    // 创建一个新的未选中的牌数组
    const newClueCards = [];
    const selectedIndices = new Set(gameState.clueSelection.selectedCards);

    // 创建一个映射，记录每张牌的新旧索引关系和卡牌信息
    const indexMap = [];
    const cardInfoMap = [];

    // 保存未选中的牌和它们的信息
    gameState.cards.clue.forEach((card, oldIndex) => {
        if (!selectedIndices.has(oldIndex)) {
            // 获取原始DOM元素
            const oldCardElement = gameState.clueSelection.cardElements[oldIndex];
            
            // 保存卡牌信息
            if (oldCardElement) {
                const cardName = oldCardElement.querySelector('.card-name')?.textContent || '';
                const cardDesc = oldCardElement.querySelector('.card-desc')?.textContent || '';
                
                // 保存卡牌信息
                cardInfoMap.push({
                    card: card,
                    name: cardName,
                    description: cardDesc
                });
            } else {
                cardInfoMap.push({
                    card: card,
                    name: '',
                    description: ''
                });
            }
            
            // 保存新牌
            newClueCards.push(card);
            indexMap.push({ oldIndex, newIndex: newClueCards.length - 1 });
        }
    });

    // 更新牌堆
    gameState.cards.clue = newClueCards;

    // 清空牌堆DOM
    const cluePile = gameState.cardPiles.clue;
    while (cluePile.firstChild) {
        cluePile.removeChild(cluePile.firstChild);
    }

    // 重置卡片元素引用数组
    gameState.clueSelection.cardElements = [];

    // 重新创建所有未选中的牌的DOM元素
    newClueCards.forEach((card, index) => {
        // 创建卡牌元素
        const cardElement = document.createElement('div');
        cardElement.className = 'playing-card selectable';
        
        // 根据花色设置卡牌颜色
        if (['♥', '♦'].includes(card.suit)) {
            cardElement.classList.add('red');
        } else {
            cardElement.classList.add('black');
        }
        
        // 创建牌面元素
        const cardValueElement = document.createElement('div');
        cardValueElement.className = 'card-value';
        cardValueElement.innerHTML = `${card.value}<span class="card-suit">${card.suit}</span>`;
        cardElement.appendChild(cardValueElement);
        
        // 创建牌面名称元素
        const cardNameElement = document.createElement('div');
        cardNameElement.className = 'card-name';
        
        // 使用之前保存的卡片名称，如果没有，再使用默认值
        const cardInfo = cardInfoMap[index];
        if (cardInfo && cardInfo.name) {
            cardNameElement.textContent = cardInfo.name;
        } else {
            cardNameElement.textContent = `${card.suitName}${card.name}`;
        }
        
        cardElement.appendChild(cardNameElement);
        
        // 创建描述元素
        const cardDescElement = document.createElement('div');
        cardDescElement.className = 'card-desc';
        
        // 使用之前保存的卡片描述
        if (cardInfo && cardInfo.description) {
            cardDescElement.textContent = cardInfo.description;
        } else {
            cardDescElement.textContent = '';
        }
        
        cardElement.appendChild(cardDescElement);
        
        // 存储DOM元素引用
        gameState.clueSelection.cardElements.push(cardElement);
        
        // 添加点击事件
        cardElement.addEventListener('click', () => {
            toggleClueCardSelection(index);
        });
        
        // 添加到牌堆
        cluePile.appendChild(cardElement);
    });

    // 重新计算线索总值
    const total = calculateOptimalTotal(gameState.cards.clue);
    gameState.resources.clue = total;

    // 更新UI
    updateResourceBars();

    // 清空选中状态
    gameState.clueSelection.selectedCards = [];

    // 滚动到最下方
    cluePile.scrollTop = cluePile.scrollHeight;
}

// 闪烁选中的线索卡牌
function flashSelectedClueCards() {
    // 获取所有选中的卡牌元素
    const selectedCardIndices = gameState.clueSelection.selectedCards;
    const selectedCardElements = selectedCardIndices.map(index => gameState.clueSelection.cardElements[index]);
    
    // 添加闪烁效果类
    selectedCardElements.forEach(element => {
        element.classList.add('flash');
    });
    
    // 3秒后移除闪烁效果
    setTimeout(() => {
        selectedCardElements.forEach(element => {
            if (element) element.classList.remove('flash');
        });
    }, 3000);
}

// 清空线索卡牌选择
function clearClueCardSelection() {
    // 移除所有卡牌的选中样式
    gameState.clueSelection.selectedCards.forEach(index => {
        const element = gameState.clueSelection.cardElements[index];
        if (element) element.classList.remove('selected');
    });
    
    // 清空选中数组
    gameState.clueSelection.selectedCards = [];
    
    // 重置计数器
    const counterValue = document.querySelector('#clue-selection-counter .counter-value');
    if (counterValue) {
        counterValue.textContent = '0';
        counterValue.className = 'counter-value';
    }
}

// 创建线索选择计数区域
function createClueSelectionCounter() {
    // 获取线索牌堆容器
    const cluePile = gameState.cardPiles.clue;
    
    // 获取牌堆所在的列
    const clueColumn = cluePile.closest('.resource-column');
    
    // 创建计数器容器
    const counterContainer = document.createElement('div');
    counterContainer.className = 'clue-selection-counter';
    counterContainer.id = 'clue-selection-counter';
    counterContainer.innerHTML = `
        <div class="counter-label">选中卡牌总值：</div>
        <div class="counter-value">0</div>
        <div class="counter-hint">提示：点击线索卡牌可选中/取消，组合为21点时可获得主动遭遇+1</div>
    `;
    
    // 将计数器添加到列的底部
    clueColumn.appendChild(counterContainer);
}

// 初始化调试功能
function initDebugFeatures() {
    const debugButton = document.getElementById('debug-button');
    const debugModal = document.getElementById('debug-modal');
    const closeButton = document.querySelector('.debug-close');
    
    // 调试按钮点击事件
    debugButton.addEventListener('click', () => {
        debugModal.style.display = 'block';
    });
    
    // 关闭按钮点击事件
    closeButton.addEventListener('click', () => {
        debugModal.style.display = 'none';
    });
    
    // 点击模态框外部关闭
    window.addEventListener('click', (event) => {
        if (event.target === debugModal) {
            debugModal.style.display = 'none';
        }
    });
    
    // 添加调试牌按钮事件
    document.getElementById('add-hunger-card').addEventListener('click', () => {
        addDebugCard('hunger');
    });
    
    document.getElementById('add-fatigue-card').addEventListener('click', () => {
        addDebugCard('fatigue');
    });
    
    document.getElementById('add-dishonor-card').addEventListener('click', () => {
        addDebugCard('dishonor');
    });
    
    document.getElementById('add-clue-card').addEventListener('click', () => {
        addDebugCard('clue');
    });
    
    document.getElementById('add-trace-card').addEventListener('click', () => {
        addDebugCard('trace');
    });
    
    // 添加创建调试道具按钮
    const addItemButton = document.createElement('button');
    addItemButton.id = 'add-debug-item';
    addItemButton.className = 'debug-button';
    addItemButton.textContent = '生成调试道具';
    addItemButton.addEventListener('click', () => {
        addDebugItem();
    });
    
    // 找到调试按钮容器并添加新按钮
    const debugButtonsContainer = document.querySelector('.debug-buttons');
    debugButtonsContainer.appendChild(addItemButton);
}

// 添加调试牌
function addDebugCard(resource) {
    if (!['hunger', 'fatigue', 'dishonor', 'clue', 'trace'].includes(resource)) {
        notificationManager.error('无效的资源类型');
        return;
    }
    
    // 抽取一张扑克牌
    const card = drawCard();
    
    // 创建描述对象
    const descriptionObj = {
        name: `调试牌 - ${resource}`,
        description: `这是一张用于调试的牌，添加到${getResourceDisplayName(resource)}牌堆中`
    };
    
    // 添加到牌堆
    addCardToPile(resource, card, descriptionObj);
    
    // 计算牌堆总值
    const total = calculateOptimalTotal(gameState.cards[resource]);
    
    // 检查特殊情况
    if (resource === 'trace') {
        // 检查是否爆牌
        if (total > config.resourceLimits.max) {
            addPassiveEncounter(1);
            clearCardPile(resource);
            gameState.resources[resource] = 0;
            
            // 保留爆牌通知
            notificationManager.warning(`添加调试卡片：${card.suitName}${card.name}，行踪超过21点，被发现！被动遭遇+1，牌堆已清空`, {
                resourceType: 'trace',
                position: 'bottom-right'
            });
        }
        // 检查是否正好21点
        else if (Math.abs(total - config.resourceLimits.max) < 0.01) {
            clearCardPile(resource);
            gameState.resources[resource] = 0;
            
            // 保留21点通知
            notificationManager.success(`添加调试卡片：${card.suitName}${card.name}，行踪达到21点，牌堆已清空！`, {
                resourceType: 'trace',
                position: 'bottom-right'
            });
        }
        else {
            gameState.resources[resource] = total;
            
            // 取消普通抽牌通知
            // 注释掉下面的通知代码
            /*
            notificationManager.info(`添加调试卡片：${card.suitName}${card.name}，行踪总值：${Math.floor(total)}`, {
                resourceType: 'trace',
                position: 'bottom-right'
            });
            */
        }
    }
    else {
        // 检查是否爆牌
        if (total > config.resourceLimits.max) {
            clearCardPile(resource);
            gameState.resources[resource] = 0;
            
            // 保留爆牌通知
            notificationManager.warning(`添加调试卡片：${card.suitName}${card.name}，${getResourceDisplayName(resource)}超过21点，牌堆已清空！`, {
                resourceType: resource,
                position: 'bottom-right'
            });
        }
        // 检查是否正好21点
        else if (Math.abs(total - config.resourceLimits.max) < 0.01) {
            clearCardPile(resource);
            gameState.resources[resource] = 0;
            
            // 保留21点通知
            notificationManager.success(`添加调试卡片：${card.suitName}${card.name}，${getResourceDisplayName(resource)}达到21点，牌堆已清空！`, {
                resourceType: resource,
                position: 'bottom-right'
            });
        }
        else {
            gameState.resources[resource] = total;
            
            // 取消普通抽牌通知
            // 注释掉下面的通知代码
            /*
            notificationManager.info(`添加调试卡片：${card.suitName}${card.name}，${getResourceDisplayName(resource)}总值：${Math.floor(total)}`, {
                resourceType: resource,
                position: 'bottom-right'
            });
            */
        }
    }
    
    // 更新UI
    updateResourceBars();
}

// 添加调试道具
function addDebugItem() {
    // 随机选择一个道具
    const debugItemsCount = config.debugItems.length;
    if (debugItemsCount === 0) {
        notificationManager.error('没有可用的调试道具');
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * debugItemsCount);
    const itemTemplate = config.debugItems[randomIndex];
    
    // 创建道具实例（添加唯一ID）
    const newItem = { ...itemTemplate, id: itemTemplate.id + '_' + Date.now() };
    
    // 添加到背包
    addItemToInventory(newItem);
    
    // 显示通知
    notificationManager.item(`获得调试道具：<span class="notification-highlight">${newItem.name}</span>`, {
        position: 'bottom-right'
    });
}

// 创建道具背包
function createItemInventory() {
    // 获取游戏容器
    const gameContainer = document.querySelector('.game-container');
    
    // 创建背包容器
    const inventorySection = document.createElement('div');
    inventorySection.className = 'inventory-section';
    inventorySection.innerHTML = `
        <h3>道具背包</h3>
        <div class="inventory-container" id="item-inventory">
            <div class="empty-inventory-message">道具背包为空</div>
        </div>
    `;
    
    // 添加到游戏容器中
    gameContainer.appendChild(inventorySection);
    
    // 添加CSS样式
    const style = document.createElement('style');
    style.textContent = `
        .inventory-section {
            margin-top: 20px;
            padding: 10px;
            border: 1px solid #ccc;
            background-color: #f9f9f9;
            border-radius: 5px;
        }
        .inventory-section h3 {
            margin-top: 0;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
        }
        .inventory-container {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            min-height: 100px;
            padding: 10px;
        }
        .item-card {
            width: 120px;
            height: 180px;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 8px;
            background-color: #fff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
            position: relative;
            cursor: pointer;
            transition: transform 0.2s;
        }
        .item-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        .item-card .card-value {
            position: absolute;
            top: 8px;
            left: 8px;
            font-size: 1.2em;
            font-weight: bold;
            z-index: 1;
        }
        .item-card.red .card-value {
            color: #d00;
        }
        .item-card.black .card-value {
            color: #000;
        }
        .item-card .card-suit {
            font-size: 1.2em;
            margin-left: 2px;
        }
        .item-name {
            font-weight: bold;
            margin-top: 28px;
            margin-bottom: 8px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
            text-align: center;
        }
        .item-description {
            font-size: 0.9em;
            color: #555;
            flex-grow: 1;
            overflow-y: auto;
        }
        .empty-inventory-message {
            width: 100%;
            height: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #999;
            font-style: italic;
        }
    `;
    document.head.appendChild(style);
}

// 向背包添加道具
function addItemToInventory(itemData) {
    const inventoryContainer = document.getElementById('item-inventory');
    
    // 移除空背包消息（如果存在）
    const emptyMessage = inventoryContainer.querySelector('.empty-inventory-message');
    if (emptyMessage) {
        inventoryContainer.removeChild(emptyMessage);
    }
    
    // 创建道具卡片
    const itemCard = document.createElement('div');
    itemCard.className = 'item-card';
    
    // 根据花色设置卡牌颜色
    if (['♥', '♦'].includes(itemData.type)) {
        itemCard.classList.add('red');
    } else {
        itemCard.classList.add('black');
    }
    
    // 创建卡牌值和花色显示
    const cardValueElement = document.createElement('div');
    cardValueElement.className = 'card-value';
    cardValueElement.innerHTML = `${itemData.value}<span class="card-suit">${itemData.type}</span>`;
    itemCard.appendChild(cardValueElement);
    
    // 创建道具名称
    const itemName = document.createElement('div');
    itemName.className = 'item-name';
    itemName.textContent = itemData.name;
    
    // 创建道具描述
    const itemDescription = document.createElement('div');
    itemDescription.className = 'item-description';
    itemDescription.textContent = itemData.description;
    
    // 添加元素到卡片
    itemCard.appendChild(itemName);
    itemCard.appendChild(itemDescription);
    
    // 添加点击事件
    itemCard.addEventListener('click', () => {
        // 显示道具详情或使用道具
        showItemDetails(itemData);
    });
    
    // 添加到背包容器
    inventoryContainer.appendChild(itemCard);
    
    // 添加到游戏状态
    gameState.items.push(itemData);
    
    // 返回已创建的卡片元素
    return itemCard;
}

// 显示道具详情
function showItemDetails(itemData) {
    // 创建详情弹窗
    let detailsModal = document.getElementById('item-details-modal');
    
    if (!detailsModal) {
        detailsModal = document.createElement('div');
        detailsModal.id = 'item-details-modal';
        detailsModal.className = 'modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content item-details-content';
        
        const closeButton = document.createElement('span');
        closeButton.className = 'close-button';
        closeButton.innerHTML = '&times;';
        closeButton.onclick = () => { detailsModal.style.display = 'none'; };
        
        modalContent.appendChild(closeButton);
        detailsModal.appendChild(modalContent);
        document.body.appendChild(detailsModal);
        
        // 添加点击外部关闭
        window.addEventListener('click', (event) => {
            if (event.target === detailsModal) {
                detailsModal.style.display = 'none';
            }
        });
    }
    
    // 更新详情内容
    const modalContent = detailsModal.querySelector('.modal-content');
    modalContent.innerHTML = '';
    
    const closeButton = document.createElement('span');
    closeButton.className = 'close-button';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = () => { detailsModal.style.display = 'none'; };
    
    // 创建卡牌花色和点数显示
    const cardTypeValue = document.createElement('div');
    cardTypeValue.className = 'card-type-value';
    
    // 根据花色设置颜色
    if (['♥', '♦'].includes(itemData.type)) {
        cardTypeValue.classList.add('red');
    } else {
        cardTypeValue.classList.add('black');
    }
    
    cardTypeValue.innerHTML = `${itemData.value} <span style="margin-left: 5px;">${itemData.type}</span>`;
    
    const title = document.createElement('h3');
    title.textContent = itemData.name;
    
    const description = document.createElement('p');
    description.textContent = itemData.description;
    
    const usageTitle = document.createElement('h4');
    usageTitle.textContent = '可用于';
    
    const usageText = document.createElement('p');
    const resourceNames = {
        'hunger': '饥饿牌堆',
        'fatigue': '疲劳牌堆',
        'dishonor': '恶名牌堆',
        'clue': '线索牌堆',
        'trace': '行踪牌堆'
    };
    
    const usageNames = itemData.usage.map(resource => resourceNames[resource] || resource).join('、');
    usageText.textContent = usageNames;
    
    // 添加使用按钮
    const useButton = document.createElement('button');
    useButton.textContent = '使用道具';
    useButton.className = 'use-item-button';
    useButton.onclick = () => {
        // 如果只有一个可用牌堆，直接使用
        if (itemData.usage.length === 1) {
            useItemOnResource(itemData, itemData.usage[0]);
            detailsModal.style.display = 'none';
        } else {
            // 否则显示选择目标牌堆的界面
            showResourceSelection(itemData);
            detailsModal.style.display = 'none';
        }
    };
    
    modalContent.appendChild(closeButton);
    modalContent.appendChild(cardTypeValue);
    modalContent.appendChild(title);
    modalContent.appendChild(description);
    modalContent.appendChild(usageTitle);
    modalContent.appendChild(usageText);
    modalContent.appendChild(useButton);
    
    // 显示详情弹窗
    detailsModal.style.display = 'block';
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .item-details-content {
            max-width: 500px;
        }
        .card-type-value {
            font-size: 2.2em;
            font-weight: bold;
            margin-bottom: 15px;
            text-align: center;
            padding: 5px 0;
        }
        .card-type-value.red {
            color: #d00;
        }
        .card-type-value.black {
            color: #000;
        }
        .use-item-button {
            display: block;
            margin: 20px auto 10px;
            padding: 8px 16px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .use-item-button:hover {
            background-color: #45a049;
        }
    `;
    
    if (!document.querySelector('style[data-item-details]')) {
        style.setAttribute('data-item-details', 'true');
        document.head.appendChild(style);
    }
}

// 显示选择目标牌堆的界面
function showResourceSelection(itemData) {
    // 创建选择界面
    let selectionModal = document.getElementById('resource-selection-modal');
    
    if (!selectionModal) {
        selectionModal = document.createElement('div');
        selectionModal.id = 'resource-selection-modal';
        selectionModal.className = 'modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content resource-selection-content';
        
        const closeButton = document.createElement('span');
        closeButton.className = 'close-button';
        closeButton.innerHTML = '&times;';
        closeButton.onclick = () => { selectionModal.style.display = 'none'; };
        
        modalContent.appendChild(closeButton);
        selectionModal.appendChild(modalContent);
        document.body.appendChild(selectionModal);
        
        // 添加点击外部关闭
        window.addEventListener('click', (event) => {
            if (event.target === selectionModal) {
                selectionModal.style.display = 'none';
            }
        });
    }
    
    // 更新内容
    const modalContent = selectionModal.querySelector('.modal-content');
    modalContent.innerHTML = '';
    
    const closeButton = document.createElement('span');
    closeButton.className = 'close-button';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = () => { selectionModal.style.display = 'none'; };
    
    const title = document.createElement('h3');
    title.textContent = '选择目标牌堆';
    
    const resourceList = document.createElement('div');
    resourceList.className = 'resource-list';
    
    // 资源名称映射
    const resourceNames = {
        'hunger': '饥饿牌堆',
        'fatigue': '疲劳牌堆',
        'dishonor': '恶名牌堆',
        'clue': '线索牌堆',
        'trace': '行踪牌堆'
    };
    
    // 为每个可用牌堆创建按钮
    itemData.usage.forEach(resource => {
        const resourceButton = document.createElement('button');
        resourceButton.className = 'resource-button';
        resourceButton.textContent = resourceNames[resource] || resource;
        resourceButton.onclick = () => {
            useItemOnResource(itemData, resource);
            selectionModal.style.display = 'none';
        };
        resourceList.appendChild(resourceButton);
    });
    
    modalContent.appendChild(closeButton);
    modalContent.appendChild(title);
    modalContent.appendChild(resourceList);
    
    // 显示选择界面
    selectionModal.style.display = 'block';
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .resource-selection-content {
            max-width: 400px;
        }
        .resource-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin: 20px 0;
        }
        .resource-button {
            padding: 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1em;
        }
        .resource-button:hover {
            background-color: #45a049;
        }
    `;
    
    if (!document.querySelector('style[data-resource-selection]')) {
        style.setAttribute('data-resource-selection', 'true');
        document.head.appendChild(style);
    }
}

// 在特定牌堆上使用道具
function useItemOnResource(itemData, resource) {
    // 创建一张牌并添加到指定牌堆
    const card = {
        suit: itemData.type,
        value: itemData.value,
        name: itemData.name,
        suitName: config.cards.suitNames[itemData.type] || itemData.type,
        description: itemData.description
    };
    
    // 从背包中移除道具
    removeItemFromInventory(itemData.id);
    
    // 创建包含道具名称和描述的actionData
    const actionData = {
        name: itemData.name,
        description: itemData.description,
        // 添加卡片描述映射，以适配addCardToPile的处理逻辑
        cardDescriptions: {
            [resource]: itemData.name
        },
        cardDetailDescriptions: {
            [resource]: itemData.description
        }
    };
    
    // 添加牌到牌堆
    addCardToPile(resource, card, actionData);
    
    // 计算新的资源值
    const total = calculateOptimalTotal(gameState.cards[resource]);
    
    // 记录特殊效果
    const specialEffects = {
        exactly21: [],
        busted: []
    };
    
    // 检查牌堆总值并处理结果
    if (total > config.resourceLimits.max) {
        // 爆牌 - 超过21点
        specialEffects.busted.push(resource);
        
        // 对于行踪牌堆爆牌，增加被动遭遇
        if (resource === 'trace') {
            addPassiveEncounter(1);
            notificationManager.error(`行踪超过21点，使用了道具：${itemData.name}，被发现！被动遭遇+1，牌堆已清空`, {
                resourceType: 'trace',
                position: 'top'
            });
        } else {
            notificationManager.error(`${getResourceDisplayName(resource)}超过21点，使用了道具：${itemData.name}，牌堆已清空！`, {
                resourceType: resource,
                position: 'top'
            });
        }
        
        // 清空牌堆
        setTimeout(() => {
            clearCardPile(resource);
            gameState.resources[resource] = 0;
            updateResourceBars();
        }, 1500);
        
        // 对于基础资源爆牌，需要触发行踪牌堆
        if (['hunger', 'fatigue', 'dishonor'].includes(resource)) {
            setTimeout(() => {
                const traceCard = drawCard();
                const triggerKey = `${resource}Bust`;
                
                // 从配置中获取描述
                const descriptionText = getLocationSpecialDescriptions('trace', triggerKey);
                const detailDescriptionText = getLocationSpecialDescriptions('trace', triggerKey, true);
                
                // 创建包含详细描述的对象
                const descriptionObj = {
                    name: descriptionText || `因${getResourceDisplayName(resource)}超过21点而暴露的行踪`,
                    description: detailDescriptionText || `使用道具${itemData.name}导致${getResourceDisplayName(resource)}超过21点，暴露了行踪。`
                };
                
                // 添加牌到行踪牌堆
                addCardToPile('trace', traceCard, descriptionObj);
                
                // 计算新的行踪值
                const traceTotal = calculateOptimalTotal(gameState.cards.trace);
                gameState.resources.trace = traceTotal;
                updateResourceBars();
            }, 2000);
        }
    } 
    else if (Math.abs(total - config.resourceLimits.max) < 0.01) {
        // 正好21点
        specialEffects.exactly21.push(resource);
        
        // 对于行踪牌堆正好21点，清空牌堆
        if (resource === 'trace') {
            notificationManager.success(`行踪达到21点，使用了道具：${itemData.name}，牌堆已清空！`, {
                resourceType: 'trace',
                position: 'top'
            });
        } else {
            notificationManager.success(`${getResourceDisplayName(resource)}达到21点，使用了道具：${itemData.name}，牌堆已清空！`, {
                resourceType: resource,
                position: 'top'
            });
        }
        
        // 清空牌堆
        setTimeout(() => {
            clearCardPile(resource);
            gameState.resources[resource] = 0;
            updateResourceBars();
        }, 1500);
        
        // 对于基础资源达到21点，需要触发线索牌堆
        if (['hunger', 'fatigue', 'dishonor'].includes(resource)) {
            setTimeout(() => {
                const clueCard = drawCard();
                const triggerKey = `${resource}21`;
                
                // 从配置中获取描述
                const descriptionText = getLocationSpecialDescriptions('clue', triggerKey);
                const detailDescriptionText = getLocationSpecialDescriptions('clue', triggerKey, true);
                
                // 创建包含详细描述的对象
                const descriptionObj = {
                    name: descriptionText || `因${getResourceDisplayName(resource)}达到21点而获得的线索`,
                    description: detailDescriptionText || `使用道具${itemData.name}使${getResourceDisplayName(resource)}达到21点，获得了重要线索。`
                };
                
                // 添加牌到线索牌堆
                addCardToPile('clue', clueCard, descriptionObj);
                
                // 计算新的线索值
                const clueTotal = calculateOptimalTotal(gameState.cards.clue);
                gameState.resources.clue = clueTotal;
                updateResourceBars();
            }, 2000);
        }
    }
    else {
        // 正常情况，更新资源值
        gameState.resources[resource] = total;
        
        // 更新UI
        updateResourceBars();
        
        // 取消普通使用道具的通知
        /* 
        notificationManager.info(`使用了道具：${itemData.name}，添加到${getResourceDisplayName(resource)}牌堆`, {
            resourceType: resource,
            position: 'top'
        });
        */
    }
}

// 从背包中移除道具
function removeItemFromInventory(itemId) {
    // 在游戏状态中移除
    const itemIndex = gameState.items.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        gameState.items.splice(itemIndex, 1);
    }
    
    // 在UI中移除
    const inventoryContainer = document.getElementById('item-inventory');
    const itemCards = inventoryContainer.querySelectorAll('.item-card');
    
    // 移除对应的卡片
    if (itemCards[itemIndex]) {
        inventoryContainer.removeChild(itemCards[itemIndex]);
    }
    
    // 如果背包为空，添加空消息
    if (gameState.items.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-inventory-message';
        emptyMessage.textContent = '道具背包为空';
        inventoryContainer.appendChild(emptyMessage);
    }
}

// 在页面加载完成后初始化游戏
window.addEventListener('DOMContentLoaded', initGame); 
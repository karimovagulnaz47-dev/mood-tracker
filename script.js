class MoodTracker {
    constructor() {
        this.moodData = this.loadMoodData();
        this.userName = this.loadUserName();
        this.moodEmojis = {
            happy: '🙂',
            neutral: '😌',
            sad: '😔'
        };
        this.moodTexts = {
            happy: 'Счастливый',
            neutral: 'Нейтральный',
            sad: 'Грустный'
        };
        
        // Расширенный список эмоций
        this.emotions = {
            happy: [
                { id: 'joy', name: 'Радость', emoji: '🙂' },
                { id: 'excitement', name: 'Восторг', emoji: '😊' },
                { id: 'gratitude', name: 'Благодарность', emoji: '🙏' },
                { id: 'love', name: 'Любовь', emoji: '💙' },
                { id: 'pride', name: 'Гордость', emoji: '😌' },
                { id: 'hope', name: 'Надежда', emoji: '✨' },
                { id: 'amusement', name: 'Веселье', emoji: '😄' },
                { id: 'satisfaction', name: 'Удовлетворение', emoji: '😌' }
            ],
            neutral: [
                { id: 'calm', name: 'Спокойствие', emoji: '😌' },
                { id: 'boredom', name: 'Скука', emoji: '😑' },
                { id: 'confusion', name: 'Растерянность', emoji: '😕' },
                { id: 'indifference', name: 'Равнодушие', emoji: '😐' },
                { id: 'tiredness', name: 'Усталость', emoji: '😴' },
                { id: 'contemplation', name: 'Размышление', emoji: '🤔' },
                { id: 'patience', name: 'Терпение', emoji: '🙂' },
                { id: 'focus', name: 'Сосредоточенность', emoji: '🧘' }
            ],
            sad: [
                { id: 'sadness', name: 'Грусть', emoji: '😔' },
                { id: 'anxiety', name: 'Тревога', emoji: '😰' },
                { id: 'anger', name: 'Злость', emoji: '😠' },
                { id: 'frustration', name: 'Разочарование', emoji: '😤' },
                { id: 'loneliness', name: 'Одиночество', emoji: '😔' },
                { id: 'fear', name: 'Страх', emoji: '😨' },
                { id: 'guilt', name: 'Вина', emoji: '😞' },
                { id: 'disappointment', name: 'Разочарование', emoji: '😕' }
            ]
        };
        
        this.selectedMood = null;
        this.selectedEmotions = [];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupUserNameHandlers();
        this.updateUserNameDisplay();
        this.updateTodayMood();
        this.renderHistory();
        this.updateDashboard();
    }
    
    setupEventListeners() {
        // Обработчики для кнопок настроения
        const moodButtons = document.querySelectorAll('.mood-btn');
        moodButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const mood = e.target.dataset.mood;
                this.selectMood(mood);
            });
        });
        
        // Обработчик для кнопки очистки
        const clearBtn = document.getElementById('clearBtn');
        clearBtn.addEventListener('click', () => {
            this.clearHistory();
        });
    }
    
    setupUserNameHandlers() {
        const saveNameBtn = document.getElementById('saveName');
        const changeNameBtn = document.getElementById('changeName');
        const userNameInput = document.getElementById('userName');
        
        saveNameBtn.addEventListener('click', () => {
            this.saveUserName();
        });
        
        changeNameBtn.addEventListener('click', () => {
            this.showNameInput();
        });
        
        userNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.saveUserName();
            }
        });
    }
    
    saveUserName() {
        const userNameInput = document.getElementById('userName');
        const name = userNameInput.value.trim();
        
        if (name.length < 2) {
            alert('Имя должно содержать минимум 2 символа');
            return;
        }
        
        this.userName = name;
        this.saveUserNameToStorage();
        this.updateUserNameDisplay();
        this.sendUserData();
    }
    
    showNameInput() {
        document.getElementById('nameInput').style.display = 'flex';
        document.getElementById('welcomeMessage').style.display = 'none';
        document.getElementById('userName').focus();
    }
    
    updateUserNameDisplay() {
        const nameInput = document.getElementById('nameInput');
        const welcomeMessage = document.getElementById('welcomeMessage');
        const displayName = document.getElementById('displayName');
        
        if (this.userName) {
            displayName.textContent = this.userName;
            nameInput.style.display = 'none';
            welcomeMessage.style.display = 'flex';
        } else {
            nameInput.style.display = 'flex';
            welcomeMessage.style.display = 'none';
        }
    }
    
    selectMood(mood) {
        this.selectedMood = mood;
        this.selectedEmotions = [];
        
        // Убираем выделение с предыдущих кнопок
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Выделяем выбранную кнопку
        document.querySelector(`[data-mood="${mood}"]`).classList.add('selected');
        
        // Показываем селектор эмоций
        this.showEmotionsSelector(mood);
    }
    
    showEmotionsSelector(mood) {
        const emotionsSelector = document.getElementById('emotionsSelector');
        const emotionsGrid = document.getElementById('emotionsGrid');
        
        // Очищаем предыдущие эмоции
        emotionsGrid.innerHTML = '';
        
        // Добавляем эмоции для выбранного настроения
        this.emotions[mood].forEach(emotion => {
            const button = document.createElement('button');
            button.className = 'emotion-btn';
            button.dataset.emotion = emotion.id;
            button.innerHTML = `
                <div style="font-size: 1.5em; margin-bottom: 5px;">${emotion.emoji}</div>
                <div>${emotion.name}</div>
            `;
            
            button.addEventListener('click', () => {
                this.toggleEmotion(emotion.id, button);
            });
            
            emotionsGrid.appendChild(button);
        });
        
        emotionsSelector.style.display = 'block';
    }
    
    toggleEmotion(emotionId, button) {
        if (this.selectedEmotions.includes(emotionId)) {
            // Убираем эмоцию
            this.selectedEmotions = this.selectedEmotions.filter(id => id !== emotionId);
            button.classList.remove('selected');
        } else {
            // Добавляем эмоцию
            this.selectedEmotions.push(emotionId);
            button.classList.add('selected');
        }
        
        // Сохраняем данные, если есть выбранные эмоции
        if (this.selectedEmotions.length > 0) {
            this.saveTodayMood();
        }
    }
    
    sendUserData() {
        // Отправляем анонимную статистику
        if (this.userName && window.analytics) {
            window.analytics.trackUser(this.userName);
        }
    }
    
    sendMoodData(moodData) {
        // Отправляем данные о настроении
        if (this.userName && window.analytics) {
            window.analytics.trackMood(this.userName, moodData.mood, moodData.emotions);
        }
    }
    
    
    saveTodayMood() {
        if (!this.selectedMood || this.selectedEmotions.length === 0) return;
        
        const today = this.getTodayString();
        
        const moodData = {
            mood: this.selectedMood,
            emotions: [...this.selectedEmotions],
            timestamp: new Date().toISOString()
        };
        
        this.moodData[today] = moodData;
        
        this.saveMoodData();
        this.updateTodayMood();
        this.renderHistory();
        this.updateDashboard();
        
        // Отправляем данные на сервер
        this.sendMoodData(moodData);
    }
    
    updateTodayMood() {
        const today = this.getTodayString();
        const todayMoodElement = document.getElementById('todayMood');
        
        if (this.moodData[today]) {
            const data = this.moodData[today];
            const mood = data.mood;
            const emotions = data.emotions || [];
            
            let emotionsText = '';
            if (emotions.length > 0) {
                const emotionNames = emotions.map(emotionId => {
                    const emotion = this.findEmotionById(emotionId);
                    return emotion ? emotion.name : emotionId;
                });
                emotionsText = `<p><strong>Эмоции:</strong> ${emotionNames.join(', ')}</p>`;
            }
            
            todayMoodElement.innerHTML = `
                <p>Ваше настроение на сегодня:</p>
                <div class="selected-mood">${this.moodEmojis[mood]}</div>
                <p>${this.moodTexts[mood]}</p>
                ${emotionsText}
            `;
        } else {
            todayMoodElement.innerHTML = '<p>Выберите свое настроение на сегодня</p>';
        }
    }
    
    findEmotionById(emotionId) {
        for (const mood in this.emotions) {
            const emotion = this.emotions[mood].find(e => e.id === emotionId);
            if (emotion) return emotion;
        }
        return null;
    }
    
    updateDashboard() {
        this.updateMoodStats();
        this.updateTopEmotions();
    }
    
    updateMoodStats() {
        const last30Days = this.getLast30DaysData();
        const totalDays = last30Days.length;
        
        if (totalDays === 0) {
            document.getElementById('happyPercent').textContent = '0%';
            document.getElementById('neutralPercent').textContent = '0%';
            document.getElementById('sadPercent').textContent = '0%';
            return;
        }
        
        const moodCounts = { happy: 0, neutral: 0, sad: 0 };
        
        last30Days.forEach(day => {
            if (this.moodData[day]) {
                moodCounts[this.moodData[day].mood]++;
            }
        });
        
        document.getElementById('happyPercent').textContent = 
            Math.round((moodCounts.happy / totalDays) * 100) + '%';
        document.getElementById('neutralPercent').textContent = 
            Math.round((moodCounts.neutral / totalDays) * 100) + '%';
        document.getElementById('sadPercent').textContent = 
            Math.round((moodCounts.sad / totalDays) * 100) + '%';
    }
    
    updateTopEmotions() {
        const last30Days = this.getLast30DaysData();
        const emotionCounts = {};
        
        last30Days.forEach(day => {
            if (this.moodData[day] && this.moodData[day].emotions) {
                this.moodData[day].emotions.forEach(emotionId => {
                    emotionCounts[emotionId] = (emotionCounts[emotionId] || 0) + 1;
                });
            }
        });
        
        const topEmotions = Object.entries(emotionCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3);
        
        const topEmotionsElement = document.getElementById('topEmotions');
        
        if (topEmotions.length === 0) {
            topEmotionsElement.innerHTML = '<p class="no-data">Недостаточно данных</p>';
            return;
        }
        
        const topEmotionsHTML = topEmotions.map(([emotionId, count]) => {
            const emotion = this.findEmotionById(emotionId);
            if (!emotion) return '';
            
            return `
                <div class="top-emotion-item">
                    <span class="emotion-name">${emotion.emoji} ${emotion.name}</span>
                    <span class="emotion-count">${count}</span>
                </div>
            `;
        }).join('');
        
        topEmotionsElement.innerHTML = topEmotionsHTML;
    }
    
    getLast30DaysData() {
        const dates = [];
        const today = new Date();
        
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            dates.push(date.toISOString().split('T')[0]);
        }
        
        return dates;
    }
    
    renderHistory() {
        const historyList = document.getElementById('historyList');
        const entries = Object.entries(this.moodData);
        
        if (entries.length === 0) {
            historyList.innerHTML = '<p class="no-data">Пока нет записей</p>';
            return;
        }
        
        // Сортируем по дате (новые сверху)
        entries.sort((a, b) => new Date(b[1].timestamp) - new Date(a[1].timestamp));
        
        const historyHTML = entries.map(([date, data]) => {
            const formattedDate = this.formatDate(date);
            const isToday = date === this.getTodayString();
            
            let emotionsText = '';
            if (data.emotions && data.emotions.length > 0) {
                const emotionNames = data.emotions.map(emotionId => {
                    const emotion = this.findEmotionById(emotionId);
                    return emotion ? emotion.name : emotionId;
                });
                emotionsText = `<div class="emotions-list">${emotionNames.join(', ')}</div>`;
            }
            
            return `
                <div class="history-item ${isToday ? 'today' : ''}">
                    <div class="mood-emoji">${this.moodEmojis[data.mood]}</div>
                    <div class="mood-info">
                        <div class="mood-text">${this.moodTexts[data.mood]}</div>
                        ${emotionsText}
                    </div>
                    <div class="date">${formattedDate}</div>
                </div>
            `;
        }).join('');
        
        historyList.innerHTML = historyHTML;
    }
    
    clearHistory() {
        if (confirm('Вы уверены, что хотите очистить всю историю настроений?')) {
            this.moodData = {};
            this.saveMoodData();
            this.updateTodayMood();
            this.renderHistory();
            this.updateDashboard();
            
            // Убираем выделение с кнопок
            document.querySelectorAll('.mood-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            
            // Скрываем селектор эмоций
            document.getElementById('emotionsSelector').style.display = 'none';
            
            this.selectedMood = null;
            this.selectedEmotions = [];
        }
    }
    
    getTodayString() {
        const today = new Date();
        return today.toISOString().split('T')[0]; // YYYY-MM-DD
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (dateString === this.getTodayString()) {
            return 'Сегодня';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Вчера';
        } else {
            return date.toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        }
    }
    
    loadMoodData() {
        try {
            const data = localStorage.getItem('moodTrackerData');
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            return {};
        }
    }
    
    saveMoodData() {
        try {
            localStorage.setItem('moodTrackerData', JSON.stringify(this.moodData));
        } catch (error) {
            console.error('Ошибка при сохранении данных:', error);
        }
    }
    
    loadUserName() {
        try {
            return localStorage.getItem('moodTrackerUserName') || '';
        } catch (error) {
            console.error('Ошибка при загрузке имени:', error);
            return '';
        }
    }
    
    saveUserNameToStorage() {
        try {
            localStorage.setItem('moodTrackerUserName', this.userName);
        } catch (error) {
            console.error('Ошибка при сохранении имени:', error);
        }
    }
}

// Инициализация приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new MoodTracker();
});
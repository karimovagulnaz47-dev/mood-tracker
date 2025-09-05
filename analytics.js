// Простая система аналитики для статического хостинга
class Analytics {
    constructor() {
        this.apiKey = 'demo-key'; // В реальном приложении будет настоящий ключ
        this.endpoint = 'https://api.example.com/analytics'; // Заглушка
        this.localData = this.loadLocalData();
    }
    
    // Отправка данных о пользователе
    trackUser(userName) {
        const data = {
            event: 'user_registered',
            userName: userName,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            language: navigator.language
        };
        
        this.sendData(data);
        this.saveLocalData(data);
    }
    
    // Отправка данных о настроении
    trackMood(userName, mood, emotions) {
        const data = {
            event: 'mood_recorded',
            userName: userName,
            mood: mood,
            emotions: emotions,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            language: navigator.language
        };
        
        this.sendData(data);
        this.saveLocalData(data);
    }
    
    // Отправка данных (заглушка для демонстрации)
    sendData(data) {
        // В реальном приложении здесь будет отправка на сервер
        console.log('📊 Аналитика:', data);
        
        // Имитация отправки данных
        if (navigator.sendBeacon) {
            // Используем sendBeacon для надежной отправки
            const blob = new Blob([JSON.stringify(data)], {
                type: 'application/json'
            });
            navigator.sendBeacon(this.endpoint, blob);
        } else {
            // Fallback для старых браузеров
            fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            }).catch(error => {
                console.log('Ошибка отправки аналитики:', error);
            });
        }
    }
    
    // Сохранение данных локально для демонстрации
    saveLocalData(data) {
        this.localData.push(data);
        localStorage.setItem('moodTrackerAnalytics', JSON.stringify(this.localData));
    }
    
    // Загрузка локальных данных
    loadLocalData() {
        try {
            return JSON.parse(localStorage.getItem('moodTrackerAnalytics') || '[]');
        } catch (error) {
            console.error('Ошибка загрузки аналитики:', error);
            return [];
        }
    }
    
    // Получение статистики (для демонстрации)
    getStats() {
        const users = new Set();
        const moods = { happy: 0, neutral: 0, sad: 0 };
        const emotions = {};
        
        this.localData.forEach(record => {
            if (record.event === 'user_registered') {
                users.add(record.userName);
            } else if (record.event === 'mood_recorded') {
                moods[record.mood]++;
                if (record.emotions) {
                    record.emotions.forEach(emotion => {
                        emotions[emotion] = (emotions[emotion] || 0) + 1;
                    });
                }
            }
        });
        
        return {
            totalUsers: users.size,
            totalRecords: this.localData.filter(r => r.event === 'mood_recorded').length,
            moodStats: moods,
            topEmotions: Object.entries(emotions)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
                .map(([emotion, count]) => ({ emotion, count }))
        };
    }
    
    // Экспорт данных для анализа
    exportData() {
        const dataStr = JSON.stringify(this.localData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `mood-tracker-analytics-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

// Глобальный экземпляр аналитики
window.analytics = new Analytics();

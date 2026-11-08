import { useState, useEffect } from 'react';
import { fetchToday, fetchSlots } from './api';
import { 
    MONTHS_NOMINATIVE, 
    MONTHS_GENITIVE, 
    DAYS_OF_WEEK, 
    buildCalendarGrid, 
    compareDates 
} from './data/date';
import './index.css';

export default function App() {

    const [todayData, setTodayData] = useState(null);
    const [todayLoading, setTodayLoading] = useState(true);
    const [todayError, setTodayError] = useState(null);

    const [selectedDate, setSelectedDate] = useState(null);
    const [slotsData, setSlotsData] = useState([]);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [slotsError, setSlotsError] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);


    const [currentDate, setCurrentDate] = useState(new Date());
    
    useEffect(() => {
        async function loadToday() {
            try {
                setTodayLoading(true);
                const data = await fetchToday();
                setTodayData(data);
                

                const initialDate = new Date(data.year, data.month, data.day);
                setSelectedDate(initialDate);
                setCurrentDate(initialDate); 
            } catch (err) {
                setTodayError(err.message);
            } finally {
                setTodayLoading(false);
            }
        }
        loadToday();
    }, []);

  
    useEffect(() => {
        if (!selectedDate) return;

        let isMounted = true;
        async function loadSlots() {
            try {
                setSlotsLoading(true);
                setSlotsError(null);
                setSelectedTime(null); 
                const data = await fetchSlots(selectedDate);
                
                if (isMounted) {
                    setSlotsData(data.slots);
                }
            } catch (err) {
                if (isMounted) {
                    setSlotsError(err.message);
                    setSlotsData([]);
                }
            } finally {
                if (isMounted) {
                    setSlotsLoading(false);
                }
            }
        }

        loadSlots();

        return () => {
            isMounted = false;
        };
    }, [selectedDate]);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDayClick = (dayObj) => {
        if (!dayObj || dayObj.isPast) return;
        setSelectedDate(dayObj.date);
    };

    const handleTimeClick = (timeObj) => {
        if (!timeObj.available) return;
        setSelectedTime(timeObj.time);
    };

    const renderBottomPanel = () => {
        if (!selectedDate) return 'Выберите дату и время';
        
        const dayOfWeek = DAYS_OF_WEEK[selectedDate.getDay() === 0 ? 6 : selectedDate.getDay() - 1];
        const dayNum = selectedDate.getDate();
        const month = MONTHS_GENITIVE[selectedDate.getMonth()];
        const year = selectedDate.getFullYear();

        let text = `Выбрано: ${dayOfWeek}, ${dayNum} ${month} ${year} г.`;
        text += selectedTime ? ` в ${selectedTime}` : ` (время не выбрано)`;
        return text;
    };

    if (todayLoading) {
        return (
            <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#8d8184' }}>
                <div className="loader">Загрузка...</div>
            </div>
        );
    }

    if (todayError) {
        return (
            <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#8d8184' }}>
                <div className="error-msg">Ошибка: {todayError}</div>
            </div>
        );
    }

    const calendarGrid = buildCalendarGrid(
        currentDate.getFullYear(), 
        currentDate.getMonth(), 
        new Date(todayData.year, todayData.month, todayData.day)
    );

    return (
        <div className="app-container">
            <header className="header">
                <div className="logo">LOGO</div>
                <nav className="nav">
                    <a href="#">Услуги</a>
                    <a href="#">Галерея</a>
                    <a href="#">Команда</a>
                    <a href="#">Отзывы</a>
                    <a href="#">Контакты</a>
                </nav>
            </header>

            <div className="step-indicator">
                <div className="step-wrapper"><div className="step-circle">1</div><div className="step-line"></div></div>
                <div className="step-wrapper"><div className="step-circle">2</div><div className="step-line"></div></div>
                <div className="step-wrapper"><div className="step-circle active">3</div><div className="step-line dark"></div></div>
                <div className="step-wrapper"><div className="step-circle">4</div><div className="step-line"></div></div>
                <div className="step-wrapper"><div className="step-circle">5</div><div className="step-line"></div></div>
            </div>

            <main className="main-content">
                <h1 className="page-title">Этап 3. Время визита</h1>

                <div className="booking-container">
                    <div className="calendar-section">
                        <div className="calendar-header">
                            <h2>{MONTHS_NOMINATIVE[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                            <div className="calendar-controls">
                                <button type="button" className="btn-arrow" onClick={handlePrevMonth}>&lt;</button>
                                <button type="button" className="btn-arrow" onClick={handleNextMonth}>&gt;</button>
                            </div>
                        </div>
                        
                        <div className="calendar-grid">
                            {DAYS_OF_WEEK.map(day => (
                                <div key={day} className="weekday">{day}</div>
                            ))}
                            {calendarGrid.map((week, weekIndex) => (
                                week.map((dayObj, dayIndex) => {
                                    if (!dayObj) return <div key={`empty-${weekIndex}-${dayIndex}`} className="day empty"></div>;                            
                                    const isSelected = compareDates(dayObj.date, selectedDate);                          
                                    return (
                                        <button 
                                            key={dayObj.day} 
                                            type="button"
                                            className={`day ${isSelected ? 'selected' : ''}`}
                                            onClick={() => handleDayClick(dayObj)}
                                            disabled={dayObj.isPast}
                                        >
                                            {dayObj.day}
                                        </button>
                                    );
                                })
                            ))}
                        </div>
                    </div>

                    <div className="time-section">
                        <h2>Доступное время</h2>          
                        {slotsLoading ? (
                            <div className="loader">Загрузка слотов...</div>
                        ) : slotsError ? (
                            <div className="error-msg">Ошибка: {slotsError}</div>
                        ) : (
                            <div className="time-grid">
                                {slotsData.map(slot => {
                                    const isActive = selectedTime === slot.time;
                                    return (
                                        <button 
                                            key={slot.time}
                                            type="button"
                                            className={`time-btn ${isActive ? 'active' : ''}`}
                                            onClick={() => handleTimeClick(slot)}
                                            disabled={!slot.available}
                                        >
                                            {slot.time} {!slot.available && <span>Занято</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
                <div className="action-block">
                    <button type="button" className="btn-submit">Продолжить</button>
                    <p className="hint-text">Нажмите на свободное время, чтобы продолжить. Занятые слоты выделены серым.</p>
                </div>

                <div className="result-panel">
                    {renderBottomPanel()}
                </div>
            </main>
            <footer className="footer">
                <div className="footer-col">
                    <div className="footer-logo">LOGO</div>
                    <p>Барбершоп для тех, кто ценит качество, стиль и атмосферу. Мы не просто стрижем — мы создаем уверенность в себе.</p>
                </div>
                <div className="footer-col">
                    <h3>КОНТАКТЫ</h3>
                    <p>📍 ул. Садовая, 15, Москва</p>
                    <p>📞 +7 (495) 123-45-67</p>
                </div>
                <div className="footer-col">
                    <h3>РЕЖИМ РАБОТЫ</h3>
                    <p>Пн-Пт: 9:00 – 21:00</p>
                    <p>Сб-Вс: 10:00 – 19:00</p>
                </div>
            </footer>
            <div className="footer-bottom">
                <span>© 2026. Все права защищены.</span>
                <a href="#">Политика конфиденциальности</a>
            </div>
        </div>
    );
}

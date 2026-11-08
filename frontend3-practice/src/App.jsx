import { useState } from 'react';
import { 
    MONTHS_NOMINATIVE, 
    MONTHS_GENITIVE, 
    DAYS_OF_WEEK, 
    buildCalendarGrid, 
    compareDates 
} from './data/date';
export default function App() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);

    const today = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const allTimes = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
    const busyTimes = ['11:00', '13:00'];

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    };

    const handleDayClick = (dayObj) => {
        if (!dayObj || dayObj.isPast) return;
        setSelectedDate(dayObj.date);
        setSelectedTime(null); 
    };

    const handleTimeClick = (time) => {
        if (busyTimes.includes(time)) return;
        setSelectedTime(time);
    };

    const calendarGrid = buildCalendarGrid(currentYear, currentMonth, today);

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
                            <h2>{MONTHS_NOMINATIVE[currentMonth]} {currentYear}</h2>
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
                        <div className="time-grid">
                            {allTimes.map(time => {
                                const isBusy = busyTimes.includes(time);
                                const isActive = selectedTime === time;

                                return (
                                    <button 
                                        key={time}
                                        type="button"
                                        className={`time-btn ${isActive ? 'active' : ''}`}
                                        onClick={() => handleTimeClick(time)}
                                        disabled={isBusy}
                                    >
                                        {time} {isBusy && <span>Занято</span>}
                                    </button>
                                );
                            })}
                        </div>
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
        </div>
    );
}
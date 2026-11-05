const monthTitle = document.getElementById('month-title');
const calendarGrid = document.getElementById('calendar-grid');
const timeGrid = document.getElementById('time-grid');
const resultPanel = document.getElementById('result-panel');
const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let selectedDate = new Date(); 
let selectedTime = null;
const allTimes = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
const busyTimes = ['11:00', '13:00'];
function renderCalendar() {
    monthTitle.textContent = `${months[currentMonth]} ${currentYear}`; 
    const oldDays = calendarGrid.querySelectorAll('.day');
    oldDays.forEach(day => day.remove());
    let firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    if (firstDayOfMonth === 0) firstDayOfMonth = 7; 
    let daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    let daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = firstDayOfMonth - 1; i > 0; i--) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day', 'disabled');
        dayDiv.textContent = daysInPrevMonth - i + 1;
        calendarGrid.appendChild(dayDiv);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        dayDiv.textContent = i;
        const thisDate = new Date(currentYear, currentMonth, i);
        thisDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (thisDate < today) {
            dayDiv.classList.add('disabled');
        } else {
            dayDiv.addEventListener('click', () => {
                document.querySelectorAll('.day').forEach(d => d.classList.remove('selected'));
                dayDiv.classList.add('selected');
                selectedDate = new Date(currentYear, currentMonth, i);
                selectedTime = null;
                renderTimes(); 
                updateResultPanel();
            });
        }
        if (selectedDate && 
            thisDate.getDate() === selectedDate.getDate() && 
            thisDate.getMonth() === selectedDate.getMonth() && 
            thisDate.getFullYear() === selectedDate.getFullYear()) {
            dayDiv.classList.add('selected');
        }
        calendarGrid.appendChild(dayDiv);
    }
}
function renderTimes() {
    timeGrid.innerHTML = '';
    allTimes.forEach(time => {
        const btn = document.createElement('button');
        btn.classList.add('time-btn');
        btn.textContent = time;
        if (busyTimes.includes(time)) {
            btn.classList.add('disabled');
            btn.innerHTML = `${time}<br><span>Занято</span>`;
        } else {
            if (selectedTime === time) {
                btn.classList.add('active');
            }     
            btn.addEventListener('click', () => {
                selectedTime = time;
                renderTimes(); 
                updateResultPanel();
            });
        }
        timeGrid.appendChild(btn);
    });
}
function updateResultPanel() {
    if (!selectedDate) {
        resultPanel.textContent = 'Выберите дату и время';
        return;
    }
    const dayOfWeek = weekDays[(selectedDate.getDay() === 0 ? 7 : selectedDate.getDay()) - 1];
    const dayNum = selectedDate.getDate();
    const month = months[selectedDate.getMonth()].toLowerCase();
    const year = selectedDate.getFullYear();
    let text = `Выбрано: ${dayOfWeek}, ${dayNum} ${month} ${year} г.`;
    
    if (selectedTime) {
        text += ` в ${selectedTime}`;
    } else {
        text += ` (время не выбрано)`;
    }

    resultPanel.textContent = text;
}
document.getElementById('prev-month').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
});
document.getElementById('next-month').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
});
renderCalendar();
renderTimes();
export const MONTHS_NOMINATIVE = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];
export const MONTHS_GENITIVE = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];
export const DAYS_OF_WEEK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export function isDateSelectable(day, month, year, today) {
    const dateToCheck = new Date(year, month, day);
    dateToCheck.setHours(0, 0, 0, 0);
    const todayCopy = new Date(today);
    todayCopy.setHours(0, 0, 0, 0);
    return dateToCheck >= todayCopy;
}

export function compareDates(date1, date2) {
    if (!date1 || !date2) return false;
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
}

export function buildCalendarGrid(year, month, today) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let firstDay = new Date(year, month, 1).getDay();
    if (firstDay === 0) firstDay = 7; 
    
    const grid = [];
    let currentWeek = [];

    for (let i = 1; i < firstDay; i++) {
        currentWeek.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        currentWeek.push({
            day,
            date,
            isPast: !isDateSelectable(day, month, year, today)
        });

        if (currentWeek.length === 7) {
            grid.push(currentWeek);
            currentWeek = [];
        }
    }

    while (currentWeek.length > 0 && currentWeek.length < 7) {
        currentWeek.push(null);
    }
    if (currentWeek.length > 0) {
        grid.push(currentWeek);
    }

    return grid;
}
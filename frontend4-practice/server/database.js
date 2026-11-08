export const database = {
    today: { day: new Date().getDate(), month: new Date().getMonth(), year: new Date().getFullYear() },
    slots: {
        'default': [
            { time: '10:00', available: true },
            { time: '11:00', available: false },
            { time: '12:00', available: true },
            { time: '13:00', available: false },
            { time: '14:00', available: true },
            { time: '15:00', available: true },
            { time: '16:00', available: true },
            { time: '17:00', available: true }
        ]
    }
};
export function getSlotsForDate(day, month, year) {
    return database.slots['default'];
}
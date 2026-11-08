export async function fetchToday() {
    const response = await fetch('/api/booking/today');
    if (!response.ok) {
        throw new Error('Не удалось загрузить данные о сегодняшнем дне');
    }
    return response.json();
}
export async function fetchSlots(date) {
    const url = `/api/slots?day=${date.getDate()}&month=${date.getMonth()}&year=${date.getFullYear()}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Не удалось загрузить доступное время');
    }
    return response.json();
}
import { database, getSlotsForDate } from './database.js';

export function mockApiPlugin() {
    return {
        name: 'mock-api',
        configureServer(server) {
            const DELAY_MS = 800; 

            server.middlewares.use(async (req, res, next) => {
                if (!req.url.startsWith('/api/')) {
                    return next();
                }
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Content-Type', 'application/json');
                await new Promise(resolve => setTimeout(resolve, DELAY_MS));
                const url = new URL(req.url, `http://${req.headers.host}`);
                if (url.pathname === '/api/booking/today') {
                    res.end(JSON.stringify(database.today));
                    return;
                }
                if (url.pathname === '/api/slots') {
                    const day = url.searchParams.get('day');
                    const month = url.searchParams.get('month');
                    const year = url.searchParams.get('year');
                    if (!day || !month || !year) {
                        res.statusCode = 400;
                        res.end(JSON.stringify({ error: 'Не передана дата' }));
                        return;
                    }
                    const slots = getSlotsForDate(day, month, year);    
                    res.end(JSON.stringify({ 
                        date: { day: Number(day), month: Number(month), year: Number(year) }, 
                        slots: slots 
                    }));
                    return;
                }
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'Not Found' }));
            });
        }
    };
}
import { calendar } from '@/lib/google-calendar';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await calendar.events.list({
            calendarId: 'primary',
            maxResults: 10,
            orderBy: 'startTime',
            singleEvents: true,
            timeMin: new Date().toISOString(),
        });

        return NextResponse.json(response.data.items);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error al obtener eventos' }, { status: 500 });
    }
}
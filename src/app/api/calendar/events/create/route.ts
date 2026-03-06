import { calendar } from '@/lib/google-calendar';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        console.log('body recibido:', body);

        const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: {
                summary: body.summary,
                description: body.description,
                start: {
                    dateTime: new Date(body.start).toISOString(),
                    timeZone: 'America/Mexico_City',
                },
                end: {
                    dateTime: new Date(body.end).toISOString(),
                    timeZone: 'America/Mexico_City',
                },
            },
        });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error al crear evento' }, { status: 500 });
    }
}
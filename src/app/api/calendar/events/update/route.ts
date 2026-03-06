import { calendar } from '@/lib/google-calendar';
import { NextResponse, NextRequest } from 'next/server';

export async function PATCH(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const eventId = searchParams.get('eventId');

        if (!eventId) {
            return NextResponse.json({ error: 'eventId es requerido' }, { status: 400 });
        }

        const body = await request.json();

        const response = await calendar.events.patch({
            calendarId: 'primary',
            eventId: eventId,
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
        return NextResponse.json({ error: 'Error al actualizar evento' }, { status: 500 });
    }
}
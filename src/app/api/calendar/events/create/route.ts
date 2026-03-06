import { calendar } from '@/lib/google-calendar';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: {
                summary: body.summary,
                description: body.description,
                start: {
                    dateTime: body.start,
                    timeZone: 'America/Mexico_City',
                },
                end: {
                    dateTime: body.end,
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
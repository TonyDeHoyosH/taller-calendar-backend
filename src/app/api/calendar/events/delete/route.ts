import { calendar } from '@/lib/google-calendar';
import { NextResponse, NextRequest } from 'next/server';

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const eventId = searchParams.get('eventId');

        if (!eventId) {
            return NextResponse.json({ error: 'eventId es requerido' }, { status: 400 });
        }

        await calendar.events.delete({
            calendarId: 'primary',
            eventId: eventId,
        });

        return NextResponse.json({ message: 'Evento eliminado correctamente' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error al eliminar evento' }, { status: 500 });
    }
}
import { CalendarService } from './calendar.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
export declare class CalendarController {
    private readonly calendarService;
    constructor(calendarService: CalendarService);
    listEvents(): Promise<import("googleapis").calendar_v3.Schema$Event[]>;
    createEvent(dto: CreateEventDto): Promise<import("googleapis").calendar_v3.Schema$Event>;
    updateEvent(eventId: string, dto: UpdateEventDto): Promise<import("googleapis").calendar_v3.Schema$Event>;
    deleteEvent(eventId: string): Promise<{
        message: string;
        eventId: string;
    }>;
}

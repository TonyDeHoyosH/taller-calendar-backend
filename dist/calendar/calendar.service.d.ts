import { ConfigService } from '@nestjs/config';
import { calendar_v3 } from 'googleapis';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
export declare class CalendarService {
    private configService;
    private readonly logger;
    private calendar;
    constructor(configService: ConfigService);
    listEvents(): Promise<calendar_v3.Schema$Event[]>;
    createEvent(dto: CreateEventDto): Promise<calendar_v3.Schema$Event>;
    updateEvent(eventId: string, dto: UpdateEventDto): Promise<calendar_v3.Schema$Event>;
    deleteEvent(eventId: string): Promise<{
        message: string;
        eventId: string;
    }>;
}

import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('calendar/events')
export class CalendarController {
    constructor(private readonly calendarService: CalendarService) { }

    @Get()
    listEvents() {
        return this.calendarService.listEvents();
    }

    @Post()
    createEvent(@Body() dto: CreateEventDto) {
        return this.calendarService.createEvent(dto);
    }

    @Patch(':eventId')
    updateEvent(@Param('eventId') eventId: string, @Body() dto: UpdateEventDto) {
        return this.calendarService.updateEvent(eventId, dto);
    }

    @Delete(':eventId')
    deleteEvent(@Param('eventId') eventId: string) {
        return this.calendarService.deleteEvent(eventId);
    }
}

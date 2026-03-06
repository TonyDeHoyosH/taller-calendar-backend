import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, calendar_v3 } from 'googleapis';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class CalendarService {
    private readonly logger = new Logger(CalendarService.name);
    private calendar: calendar_v3.Calendar;

    constructor(private configService: ConfigService) {
        const clientId = this.configService.get<string>('google.clientId');
        const clientSecret = this.configService.get<string>('google.clientSecret');
        const refreshToken = this.configService.get<string>('google.refreshToken');

        const oauth2Client = new google.auth.OAuth2(
            clientId,
            clientSecret,
        );

        if (refreshToken) {
            oauth2Client.setCredentials({ refresh_token: refreshToken });
        }

        this.calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    }

    async listEvents() {
        try {
            const response = await this.calendar.events.list({
                calendarId: 'primary',
                timeMin: new Date().toISOString(),
                maxResults: 10,
                singleEvents: true,
                orderBy: 'startTime',
                timeZone: 'America/Mexico_City',
            });
            return response.data.items || [];
        } catch (error) {
            this.logger.error('Error al obtener los eventos de Google Calendar', error);
            throw new InternalServerErrorException('No se pudieron obtener los eventos');
        }
    }

    async createEvent(dto: CreateEventDto) {
        try {
            const response = await this.calendar.events.insert({
                calendarId: 'primary',
                requestBody: {
                    summary: dto.summary,
                    description: dto.description,
                    start: {
                        dateTime: new Date(dto.start).toISOString(),
                        timeZone: 'America/Mexico_City',
                    },
                    end: {
                        dateTime: new Date(dto.end).toISOString(),
                        timeZone: 'America/Mexico_City',
                    },
                },
            });
            return response.data;
        } catch (error) {
            this.logger.error('Error al crear el evento en Google Calendar', error);
            throw new InternalServerErrorException('No se pudo crear el evento');
        }
    }

    async updateEvent(eventId: string, dto: UpdateEventDto) {
        try {
            const requestBody: any = {};

            if (dto.summary) requestBody.summary = dto.summary;
            if (dto.description) requestBody.description = dto.description;
            if (dto.start) {
                requestBody.start = {
                    dateTime: new Date(dto.start).toISOString(),
                    timeZone: 'America/Mexico_City',
                };
            }
            if (dto.end) {
                requestBody.end = {
                    dateTime: new Date(dto.end).toISOString(),
                    timeZone: 'America/Mexico_City',
                };
            }

            const response = await this.calendar.events.patch({
                calendarId: 'primary',
                eventId,
                requestBody,
            });

            return response.data;
        } catch (error: any) {
            if (error.code === 404) {
                throw new NotFoundException(`Evento con ID ${eventId} no encontrado`);
            }
            this.logger.error(`Error al actualizar el evento ${eventId}`, error);
            throw new InternalServerErrorException('No se pudo actualizar el evento');
        }
    }

    async deleteEvent(eventId: string) {
        try {
            await this.calendar.events.delete({
                calendarId: 'primary',
                eventId,
            });
            return { message: 'Evento eliminado exitosamente', eventId };
        } catch (error: any) {
            if (error.code === 404) {
                throw new NotFoundException(`Evento con ID ${eventId} no encontrado`);
            }
            this.logger.error(`Error al eliminar el evento ${eventId}`, error);
            throw new InternalServerErrorException('No se pudo eliminar el evento');
        }
    }
}

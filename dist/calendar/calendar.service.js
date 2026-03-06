"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CalendarService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const googleapis_1 = require("googleapis");
let CalendarService = CalendarService_1 = class CalendarService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(CalendarService_1.name);
        const clientId = this.configService.get('google.clientId');
        const clientSecret = this.configService.get('google.clientSecret');
        const refreshToken = this.configService.get('google.refreshToken');
        const oauth2Client = new googleapis_1.google.auth.OAuth2(clientId, clientSecret);
        if (refreshToken) {
            oauth2Client.setCredentials({ refresh_token: refreshToken });
        }
        this.calendar = googleapis_1.google.calendar({ version: 'v3', auth: oauth2Client });
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
        }
        catch (error) {
            this.logger.error('Error al obtener los eventos de Google Calendar', error);
            throw new common_1.InternalServerErrorException('No se pudieron obtener los eventos');
        }
    }
    async createEvent(dto) {
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
        }
        catch (error) {
            this.logger.error('Error al crear el evento en Google Calendar', error);
            throw new common_1.InternalServerErrorException('No se pudo crear el evento');
        }
    }
    async updateEvent(eventId, dto) {
        try {
            const requestBody = {};
            if (dto.summary)
                requestBody.summary = dto.summary;
            if (dto.description)
                requestBody.description = dto.description;
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
        }
        catch (error) {
            if (error.code === 404) {
                throw new common_1.NotFoundException(`Evento con ID ${eventId} no encontrado`);
            }
            this.logger.error(`Error al actualizar el evento ${eventId}`, error);
            throw new common_1.InternalServerErrorException('No se pudo actualizar el evento');
        }
    }
    async deleteEvent(eventId) {
        try {
            await this.calendar.events.delete({
                calendarId: 'primary',
                eventId,
            });
            return { message: 'Evento eliminado exitosamente', eventId };
        }
        catch (error) {
            if (error.code === 404) {
                throw new common_1.NotFoundException(`Evento con ID ${eventId} no encontrado`);
            }
            this.logger.error(`Error al eliminar el evento ${eventId}`, error);
            throw new common_1.InternalServerErrorException('No se pudo eliminar el evento');
        }
    }
};
exports.CalendarService = CalendarService;
exports.CalendarService = CalendarService = CalendarService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CalendarService);
//# sourceMappingURL=calendar.service.js.map
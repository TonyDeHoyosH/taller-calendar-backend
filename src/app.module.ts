import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CalendarModule } from './calendar/calendar.module';
import googleConfig from './config/google.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env.local', '.env'],
            load: [googleConfig],
        }),
        CalendarModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Habilitar CORS para cualquier origen
    app.enableCors({
        origin: '*',
    });

    // Habilitar pipes globales para validación de DTOs
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        }),
    );

    // Habilitar filtro global para excepciones HTTP
    app.useGlobalFilters(new AllExceptionsFilter());

    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

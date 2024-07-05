import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

async function bootstrap() {

  // Logger para una mejor vista del servidor
  const logger = new Logger();
  dotenv.config();

  // Aquí se crea el servidor
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  /* Uso de los pipeValidators */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );

  const port = process.env.PORT || 3000;

  /* Mi prefijo */
  app.setGlobalPrefix('asesoresapp/api');
  await app.listen(port);

  /* Mostramos el mensaje del logger */
  logger.log(`The server is running on server ${port}`);
}
bootstrap();

import { INestApplication, ValidationPipe } from '@nestjs/common';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

let app: INestApplication;

/**
 * Starts and waits for a Nest Application on a certain port
 * @return {Promise<void>}
 */
export async function startServer(
  port: number | null
): Promise<INestApplication> {
  app = await NestFactory.create(AppModule);
  await app.listen(port);

  return app;
}

/**
 * Closes a Nest Application
 * @return {Promise<void>}
 */
export async function closeServer(): Promise<void> {
  await app.close();
}

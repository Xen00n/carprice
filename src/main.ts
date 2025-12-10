import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
const cookieSesion = require('cookie-session');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieSesion({
    keys: ['asdfdf2341234adsf']
  }));
  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true,
    },
  ));
  await app.listen(process.env.PORT ?? 300);
}
bootstrap();

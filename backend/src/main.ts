import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: ['https://dev-blog-three-blue.vercel.app', 'http://localhost:3000'],
    credentials: true,
  });

  // Increase body size limit for image uploads
  app.use(require('express').json({ limit: '10mb' }));
  app.use(require('express').urlencoded({ limit: '10mb', extended: true }));
  
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();

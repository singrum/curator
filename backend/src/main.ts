import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { register } from 'tsconfig-paths';
import tsConfig from '../tsconfig.json';
import { AppModule } from './app.module';

type TsConfig = {
  compilerOptions?: {
    baseUrl?: string;
    paths?: { [key: string]: string[] };
  };
};

const tsConfigObj: TsConfig = tsConfig as TsConfig;
register({
  baseUrl: tsConfigObj.compilerOptions?.baseUrl || './',
  paths: tsConfigObj.compilerOptions?.paths || {},
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser()); // 이 줄이 반드시 있어야 req.cookies를 읽을 수 있습니다.

  // CORS 설정 (Next.js와 통신 시 필수)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 속성은 거름
      forbidNonWhitelisted: true, // DTO에 없는 속성이 들어오면 에러 발생
      transform: true, // 요청 데이터를 DTO 타입으로 자동 변환
    }),
  );
  app.enableCors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  });
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();

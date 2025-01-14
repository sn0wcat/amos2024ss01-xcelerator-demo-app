import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { BackendConfig } from 'common-backend-models';
import { SwaggerDocumentBuilder } from 'common-backend-swagger';
import { API_BASE_SEGMENT } from 'common-shared-models';

/* Modules */
import { AppModule } from './app/app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors();

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
		}),
	);

	const configService = app.get(ConfigService<BackendConfig>);

	const port = configService.get('app', { infer: true }).port;
	const baseUrl = `http://localhost:${port}${API_BASE_SEGMENT}`;

	app.setGlobalPrefix(API_BASE_SEGMENT);

	const swaggerBuilder = new SwaggerDocumentBuilder(app, configService.get('swagger'), baseUrl);
	swaggerBuilder.setupSwagger();

	await app.listen(port);

	Logger.log(`🚀 Application is running on: ${baseUrl}`);
}

bootstrap();

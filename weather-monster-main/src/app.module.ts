import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CityModule } from './cities/cities.module';
import { TemperaturesModule } from './temperatures/temperatures.module';
import { ForecastsModule } from './forecasts/forecasts.module';
import { WebhooksModule } from './webhooks/webhooks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    CityModule,
    TemperaturesModule,
    ForecastsModule,
    WebhooksModule,
  ],
})
export class AppModule {}

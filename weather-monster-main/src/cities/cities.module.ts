import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CityService } from './cities.service';
import { CityController } from './cities.controller';

@Module({
  providers: [CityService],
  imports: [PrismaModule],
  controllers: [CityController],
})
export class CityModule {}

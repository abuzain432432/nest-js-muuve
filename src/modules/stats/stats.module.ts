import { Module } from '@nestjs/common';

import { PropertyModule } from 'src/modules/property/property.module';
import { TourModule } from 'src/modules/tour/tour.module';

import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

@Module({
  imports: [PropertyModule, TourModule],
  providers: [StatsService],
  controllers: [StatsController],
})
export class StatsModule {}

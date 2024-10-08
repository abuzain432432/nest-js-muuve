import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { PropertyModule } from 'src/modules/property/property.module';
import { StatsController } from './stats.controller';
import { TourModule } from 'src/modules/tour/tour.module';

@Module({
  imports: [PropertyModule, TourModule],
  providers: [StatsService],
  controllers: [StatsController],
})
export class StatsModule {}

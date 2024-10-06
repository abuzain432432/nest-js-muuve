import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { PropertyModule } from '../property/property.module';
import { StatsController } from './stats.controller';

@Module({
  imports: [PropertyModule],
  providers: [StatsService],
  controllers: [StatsController],
})
export class StatsModule {}

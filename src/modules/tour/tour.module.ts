import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Tour, TourSchema } from './schemas/tour.schema';
import { TourController } from './tour.controller';
import { TourService } from './tour.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tour.name, schema: TourSchema }]),
  ],
  providers: [TourService],
  controllers: [TourController],
  exports: [TourService],
})
export class TourModule {}

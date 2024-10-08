import { Module } from '@nestjs/common';
import { TourService } from './tour.service';
import { TourController } from './tour.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tour, TourSchema } from './schemas/tour.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tour.name, schema: TourSchema }]),
  ],
  providers: [TourService],
  controllers: [TourController],
  exports: [TourService],
})
export class TourModule {}

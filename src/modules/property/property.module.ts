import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { Property, PropertySchema } from './schemas/property.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [PropertyController],
  imports: [
    MongooseModule.forFeature([
      { name: Property.name, schema: PropertySchema },
    ]),
  ],
  providers: [PropertyService],
  exports: [PropertyService],
})
export class PropertyModule {}

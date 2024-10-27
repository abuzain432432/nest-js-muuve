import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { Property, PropertySchema } from './schemas/property.schema';

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

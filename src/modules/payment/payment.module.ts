import { Module } from '@nestjs/common';

import { PropertyModule } from 'src/modules/property/property.module';
import { UsersModule } from 'src/modules/user/user.module';

import { PaymentController } from './payment.controller';
import PaymentService from './payment.service';

@Module({
  imports: [UsersModule, PropertyModule],
  providers: [PaymentService],
  exports: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}

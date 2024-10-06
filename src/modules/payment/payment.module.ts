import { Module } from '@nestjs/common';
import PaymentService from './payment.service';
import { PaymentController } from './payment.controller';
import { UsersModule } from 'src/modules/user/user.module';
import { PropertyModule } from 'src/modules/property/property.module';

@Module({
  imports: [UsersModule, PropertyModule],
  providers: [PaymentService],
  exports: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}

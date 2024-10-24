import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  Request,
  Req,
  RawBodyRequest,
  Headers,
} from '@nestjs/common';
import PaymentService from './payment.service';
import { RolesEnum } from 'src/common/enums/roles.enum';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateSubscriptionSessionDto } from './dtos/create-subscription-session.dto';
import { IRequest } from 'src/common/types/request.type';
import { StripeEventsTypesEnum } from './enums/stripe-events.enum';
import Stripe from 'stripe';
import { CreateListingFeeCheckoutDto } from './dtos/create-listing-fee-checkout.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  @Get('subscriptions/plans')
  findAllMessagesOfAConversation() {
    return this.paymentService.getPricingPlans();
  }
  @Post('subscriptions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([RolesEnum.AGENT])
  createSubscriptionSession(
    @Body() data: CreateSubscriptionSessionDto,
    @Request() req: IRequest,
  ) {
    return this.paymentService.createSubscriptionSession(data, req.user);
  }

  @Post('listing-fee')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([RolesEnum.LANDLORD])
  createListingFeeCheckout(
    @Body() data: CreateListingFeeCheckoutDto,
    @Request() req: IRequest,
  ) {
    return this.paymentService.createListingFeeCheckout(data, req.user);
  }

  @Get('customer-portal')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([RolesEnum.AGENT])
  async getCustomerPortalUrl(@Request() req: IRequest) {
    const customerId = req.user.customerId;
    const data = await this.paymentService.getCustomerPortalUrl(customerId);
    return data;
  }

  @Post('hooks')
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') sig: string,
  ) {
    const session = this.paymentService.constructEvent(req.rawBody, sig);
    const eventType = session.type as StripeEventsTypesEnum;
    console.log('#_____________ RECEIVED EVENT _____________#');
    console.log(eventType);
    console.log('#__________________________________________#');

    switch (eventType) {
      case StripeEventsTypesEnum.InvoicePaymentFailed:
        await this.paymentService.handleInvoicePaymentFailed(
          session.data.object as Stripe.Invoice,
        );
        break;
      case StripeEventsTypesEnum.CheckoutSessionCompleted:
        await this.paymentService.handleCheckoutSessionCompleted(
          session.data.object as Stripe.Checkout.Session,
        );
        break;
      case StripeEventsTypesEnum.InvoicePaid:
        await this.paymentService.handleInvoicePaid(
          session.data.object as Stripe.Invoice,
        );
        break;
      case StripeEventsTypesEnum.CustomerSubscriptionUpdated:
        await this.paymentService.handleCustomerSubscriptionUpdated(
          session.data.object as Stripe.Subscription,
        );
        break;
      case StripeEventsTypesEnum.CustomerSubscriptionDeleted:
        await this.paymentService.handleCustomerSubscriptionDeleted(
          session.data.object as Stripe.Subscription,
        );
        break;
      default:
        console.log('#__________________________#');
        console.log('Unhandled event', eventType);
        console.log('#__________________________#');
    }
  }
}

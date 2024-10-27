import { Injectable, BadRequestException } from "@nestjs/common";

import { IUser } from "src/common/types/user.type";
import { ConfigService } from "src/modules/config/config.service";
import Stripe from "stripe";

import { PropertyStatusEnum } from "../property/enums/property-status.enum";
import { PropertyService } from "../property/property.service";
import { UserService } from "../user/user.service";

import { CreateListingFeeCheckoutDto } from "./dtos/create-listing-fee-checkout.dto";
import { CreateSubscriptionSessionDto } from "./dtos/create-subscription-session.dto";

@Injectable()
export default class PaymentService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private propertyService: PropertyService,
  ) {
    this.stripe = new Stripe(configService.get("STRIPE_SECRET_KEY"), {
      apiVersion: "2024-06-20",
    });
  }
  constructEvent(payload: Buffer, sig: string | string[]): Stripe.Event {
    const webhookSecret = this.configService.get("STRIPE_WEB_HOOK_SECRET");
    try {
      return this.stripe.webhooks.constructEvent(payload, sig, webhookSecret);
    } catch (err) {
      // TODO use the logger service to log the error
      throw new BadRequestException(
        `Webhook signature verification failed: ${err.message}`,
      );
    }
  }
  // TODO we store the results of this method in the cache for 24 hours
  async getPricingPlans() {
    const plans = (
      await this.stripe.plans.list({
        expand: ["data.product"],
      })
    ).data;
    const formattedPlans = plans.map((plan) => ({
      id: plan.id,
      name: (plan.product as Stripe.Product).name,
      amount: plan.amount / 100,
      currency: plan.currency,
      interval: plan.interval,
    }));
    return formattedPlans;
  }
  async createSubscriptionSession(
    { cancelUrl, priceId, successUrl }: CreateSubscriptionSessionDto,
    user: IUser,
  ): Promise<{ url: string }> {
    // if (user.subscriptionId) {
    //   throw new BadRequestException('User already has a subscription');
    // }
    const validPlans = await this.getPricingPlans();
    const validPlan = validPlans.find((plan) => plan.id === priceId);
    if (!validPlan) {
      throw new BadRequestException("Invalid price ID");
    }
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        customer_email: user.email,
        metadata: {
          isInitialCharge: "true",
        },
      });

      return { url: session.url };
    } catch (error) {
      // TODO use the logger service to log the error
      throw new Error("Unable to create subscription session");
    }
  }

  async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
    console.log(session);
    // NOTE check if the session is for property listing fee
    const propertyId = session.metadata.propertyId as string;
    if (propertyId) {
      return this.handlePropertyCheckoutSessionCompleted(propertyId);
    }
    const subscriptionId = session.subscription as string;
    const customerId = session.customer as string;
    const customerEmail = session.customer_email as string;
    const subscription: any =
      await this.stripe.subscriptions.retrieve(subscriptionId);

    if (!subscription) {
      throw new BadRequestException("Invalid subscription ID");
    }
    const plan = (await this.getPricingPlans()).find(
      (plan) => plan.id === subscription.plan.id,
    );

    if (!plan) {
      throw new BadRequestException("Invalid plan ID");
    }

    const { name: planName, interval } = plan;
    const {
      current_period_end: currentPeriodEnd,
      current_period_start: currentPeriodStart,
      status: subscriptionStatus,
    } = subscription;

    const updatedUser = await this.userService.updateByEmail(customerEmail, {
      customerId,
      subscriptionId,
      currentPeriodEnd,
      currentPeriodStart,
      subscriptionStatus,
      planName,
      interval,
    });
    if (!updatedUser) {
      throw new BadRequestException("User not found");
    }
    return { received: true };
  }
  async handleInvoicePaid(invoice: Stripe.Invoice) {
    console.log("++++++++++++++++++ INVOICE PAID ++++++++++++++++++++++++");
    console.log(invoice);
    const updatedUser = await this.userService.updateByEmail(
      invoice.customer_email,
      {
        invoiceStatus: invoice.status,
      },
    );
    if (!updatedUser) {
      throw new BadRequestException("User not found");
    }
    return { received: true };
  }
  async handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    console.log(
      "+++++++++++++++++++ PAYMENT FAILED FOR INVOICE +++++++++++++++++++++++",
    );
    console.log(invoice);
    //NOTE  CHECK if invoice is failed for the first time not for recurring
    // if (invoice.billing_reason === 'subscription_create') {
    //   return { received: true };
    // }
    const subscription: any = await this.stripe.subscriptions.retrieve(
      invoice.subscription as string,
    );

    console.log("++++++++++++++++++++  subscription   +++++++++++++++++++++++");
    console.log(subscription);
    const updatedUser = await this.userService.updateByEmail(
      invoice.customer_email,
      {
        invoiceStatus: invoice.status,
      },
    );

    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    console.log(updatedUser);
    if (!updatedUser) {
      throw new BadRequestException("User not found");
    }
    return { received: true };
  }
  async getCustomerPortalUrl(customerId: string) {
    const session = await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: this.configService.get("FRONTEND_BASE_URL"),
    });
    return { url: session.url };
  }
  async handleCustomerSubscriptionUpdated(subscription: any) {
    console.log("0000000000000000000  UPDATED  00000000000000000000");
    console.log(subscription);
    const planId = subscription.plan.id as string;
    const customerId = subscription.customer as string;

    const plan = (await this.getPricingPlans()).find(
      (plan) => plan.id === planId,
    );

    if (!plan) {
      throw new BadRequestException("Invalid plan ID");
    }

    const updatedUser = await this.userService.updateByCustomerId(customerId, {
      subscriptionId: subscription.id,
      planName: plan.name,
      currentPeriodStart: subscription.current_period_start,
      currentPeriodEnd: subscription.current_period_end,
      subscriptionStatus: subscription.status,
      interval: plan.interval,
    });

    if (!updatedUser) {
      throw new BadRequestException("User not found");
    }

    return { received: true };
  }
  async handleCustomerSubscriptionDeleted(subscription: any) {
    const customerId = subscription.customer as string;
    const updatedUser = await this.userService.updateByCustomerId(customerId, {
      subscriptionId: null,
      planName: null,
      currentPeriodStart: null,
      currentPeriodEnd: null,
      subscriptionStatus: null,
      interval: null,
      invoiceStatus: null,
      customerId: null,
    });

    if (!updatedUser) {
      throw new BadRequestException("User not found");
    }

    return { received: true };
  }
  async createListingFeeCheckout(
    data: CreateListingFeeCheckoutDto,
    user: IUser,
  ) {
    const propertyDetails = (
      await this.propertyService.findOneById(data.propertyId)
    ).toObject();
    //! TODO check if property is owned by the user
    if (!propertyDetails) {
      throw new BadRequestException("Property not found");
    }
    if (propertyDetails.status !== PropertyStatusEnum.DRAFT) {
      throw new BadRequestException("Bad request");
    }
    const session = await this.stripe.checkout.sessions.create({
      customer_email: user.email,
      metadata: { propertyId: propertyDetails._id.toString() },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: propertyDetails.name,
              images: [...propertyDetails.photos.slice(0, 1)],
            },
            unit_amount: 100 * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: data.successUrl,
      cancel_url: data.cancelUrl,
    });
    return {
      url: session.url,
    };
  }
  async handlePropertyCheckoutSessionCompleted(propertyId: string) {
    const updatedProperty = await this.propertyService.update(propertyId, {
      status: PropertyStatusEnum.AVAILABLE,
    });
    if (!updatedProperty) {
      throw new BadRequestException("Property not found");
    }
    return { received: true };
  }
}
//
// stripe listen --forward-to http://localhost:3000/api/payments/hooks

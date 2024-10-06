import {
  Controller,
  UseGuards,
  Body,
  Get,
  Post,
  Request,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { CreatePropertyDto } from './dtos/create-property.dto';
import { PropertyService } from './property.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesEnum } from 'src/common/enums/roles.enum';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { IRequest } from 'src/common/types/request.type';
import { HasActiveSubscription } from 'src/common/decorators/has-active-subscription.decorator';
import { ActiveSubscriptionGuard } from 'src/common/guards/active-subscription.guard';
import { IsMongoIdPipe } from 'src/common/pipes/monogo-id.pipe';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Properties')
@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  @HasActiveSubscription(true)
  @Roles([RolesEnum.LANDLORD, RolesEnum.AGENT])
  @UseGuards(JwtAuthGuard, RolesGuard, ActiveSubscriptionGuard)
  create(@Body() data: CreatePropertyDto, @Request() req: IRequest) {
    return this.propertyService.create(data, req.user);
  }
  @Get('/publish/:id')
  @HasActiveSubscription(true)
  @Roles([RolesEnum.LANDLORD, RolesEnum.AGENT])
  @UseGuards(JwtAuthGuard, RolesGuard, ActiveSubscriptionGuard)
  async publishPropertyOfAgentOrSubUser(
    @Param('id', IsMongoIdPipe) id: string,
  ) {
    return this.propertyService.publishPropertyOfAgentOrSubUser(id);
  }
}

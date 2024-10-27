import {
  Controller,
  UseGuards,
  Get,
  Request,
  Param,
  Body,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesEnum } from 'src/common/enums/roles.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { MESSAGES } from 'src/common/messages';
import { IRequest } from 'src/common/types/request.type';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

import { CreateTourDto } from './dtos/create-tour.dto';
import { TourService } from './tour.service';

@ApiTags('Tours')
@Controller('tours')
export class TourController {
  constructor(private tourService: TourService) {}
  @Post()
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: { message: 'Unauthorized' },
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
    example: { message: MESSAGES.ACTION_NOT_ALLOWED },
  })
  @Roles([RolesEnum.TENANT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() data: CreateTourDto, @Request() req: IRequest) {
    return this.tourService.create(data, req.user);
  }

  @Get(':id/approve')
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: { message: 'Unauthorized' },
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
    example: { message: MESSAGES.ACTION_NOT_ALLOWED },
  })
  @ApiBearerAuth()
  @Roles([RolesEnum.LANDLORD, RolesEnum.AGENT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  approveTour(@Request() req: IRequest, @Param('id') id: string) {
    return this.tourService.approveTour(id, req.user);
  }

  @Get(':id/reject')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: { message: 'Unauthorized' },
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
    example: { message: MESSAGES.ACTION_NOT_ALLOWED },
  })
  @Roles([RolesEnum.LANDLORD, RolesEnum.AGENT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  rejectTour(@Request() req: IRequest, @Param('id') id: string) {
    return this.tourService.rejectTour(id, req.user);
  }

  @Get()
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: { message: 'Unauthorized' },
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
    example: { message: MESSAGES.ACTION_NOT_ALLOWED },
  })
  @ApiBearerAuth()
  @Roles([RolesEnum.LANDLORD, RolesEnum.AGENT, RolesEnum.TENANT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  getMyTours(@Request() req: IRequest) {
    return this.tourService.getMyTours(req.user);
  }
}

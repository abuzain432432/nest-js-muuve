import {
  Controller,
  UseGuards,
  Get,
  Request,
  Param,
  Body,
  Post,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesEnum } from 'src/common/enums/roles.enum';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { TourService } from './tour.service';
import { IRequest } from 'src/common/types/request.type';
import { CreateTourDto } from './dtos/create-tour.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Tours')
@Controller('tours')
export class TourController {
  constructor(private tourService: TourService) {}
  @Post()
  @Roles([RolesEnum.TENANT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() data: CreateTourDto, @Request() req: IRequest) {
    return this.tourService.create(data, req.user);
  }

  @Get(':id/approve')
  @Roles([RolesEnum.LANDLORD, RolesEnum.AGENT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  approveTour(@Request() req: IRequest, @Param('id') id: string) {
    return this.tourService.approveTour(id, req.user);
  }
  @Get(':id/reject')
  @Roles([RolesEnum.LANDLORD, RolesEnum.AGENT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  rejectTour(@Request() req: IRequest, @Param('id') id: string) {
    return this.tourService.rejectTour(id, req.user);
  }
  @Get('/properties')
  @Roles([RolesEnum.LANDLORD, RolesEnum.AGENT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  getMyPropertiesTours(@Request() req: IRequest) {
    return this.tourService.getMyPropertiesTours(req.user);
  }
}

import { Controller, UseGuards, Get, Request, Param } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesEnum } from 'src/common/enums/roles.enum';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { StatsService } from './stats.service';
import { IRequest } from 'src/common/types/request.type';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Stats')
@Controller('stats')
export class StatsController {
  constructor(private statsService: StatsService) {}
  @Get('/:year')
  @Roles([RolesEnum.ADMIN, RolesEnum.AGENT, RolesEnum.LANDLORD])
  @UseGuards(JwtAuthGuard, RolesGuard)
  getStatsByYear(@Request() req: IRequest, @Param('year') year: number) {
    return this.statsService.getStatsByYear(req.user, year);
  }
}

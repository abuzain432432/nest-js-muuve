import { Controller, Get, Param, UsePipes, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesEnum } from 'src/common/enums/roles.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { MESSAGES } from 'src/common/messages';
import { IsMongoIdPipe } from 'src/common/pipes/monogo-id.pipe';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: { message: 'Unauthorized' },
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
    example: { message: MESSAGES.ACTION_NOT_ALLOWED },
  })
  @Roles([RolesEnum.ADMIN])
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles([RolesEnum.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(IsMongoIdPipe)
  findOne(@Param('id', IsMongoIdPipe) id: string) {
    console.log(id);
    return this.userService.findOneById(id);
  }
}

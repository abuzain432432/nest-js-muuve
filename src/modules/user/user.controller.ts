import { Controller, Get, Param, UsePipes, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { IsMongoIdPipe } from 'src/common/pipes/monogo-id.pipe';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesEnum } from 'src/common/enums/roles.enum';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @Roles([RolesEnum.ADMIN])
  @UseGuards(AuthGuard)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles([RolesEnum.ADMIN])
  @UsePipes(IsMongoIdPipe)
  findOne(@Param('id', IsMongoIdPipe) id: string) {
    console.log(id);
    return this.userService.findOneById(id);
  }
}

import { Controller, Get, Param, UsePipes, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { IsMongoIdPipe } from 'src/common/pipes/monogo-id.pipe';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesEnum } from 'src/common/enums/roles.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get()
  //NOTE As with pipes and exception filters, we can also pass an in-place instance
  @Roles([RolesEnum.ADMIN])
  @UseGuards(RolesGuard)
  findAll() {
    return this.userService.findAll();
  }
  @Get(':id')
  @Roles([RolesEnum.ADMIN])
  @UseGuards(RolesGuard)
  @UsePipes(IsMongoIdPipe)
  findOne(@Param('id', IsMongoIdPipe) id: string) {
    console.log(id);
    return this.userService.findOneById(id);
  }
}

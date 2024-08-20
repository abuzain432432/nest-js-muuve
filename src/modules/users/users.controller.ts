import { Controller, Get, Body, Param, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto } from './dto/login.dto';
import { IsMongoIdPipe } from 'src/common/pipes/monogo-id.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get()
  findAll(@Body() data: LoginDto) {
    console.log(data);
    return this.userService.findAll();
  }
  @Get(':id')
  @UsePipes(IsMongoIdPipe)
  findOne(@Param('id', IsMongoIdPipe) id: string) {
    console.log(id);
    return this.userService.findOneById(id);
  }
}

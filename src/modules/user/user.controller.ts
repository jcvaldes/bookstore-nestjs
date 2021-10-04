import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this._userService.get(id);
  }
  @Get()
  async getUsers(): Promise<User[]> {
    return await this._userService.getAll();
  }
  @Post()
  async createUser(@Body() user: User): Promise<User> {
    return await this._userService.create(user);
  }
  @Patch(':id')
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: User) {
    await this._userService.upodate(id, user);
  }
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this._userService.delete(id);
  }
}

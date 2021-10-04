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
import { RoleService } from './role.service';
import { Role } from './role.entity';

@Controller('users')
export class RoleController {
  constructor(private readonly _roleService: RoleService) {}

  @Get(':id')
  async getRole(@Param('id', ParseIntPipe) id: number): Promise<Role> {
    return this._roleService.get(id);
  }
  @Get()
  async getRoles(): Promise<Role[]> {
    return await this._roleService.getAll();
  }
  @Post('create')
  async createRole(@Body() role: Role): Promise<Role> {
    return await this._roleService.create(role);
  }
  @Patch(':id')
  async updateRole(@Param('id', ParseIntPipe) id: number, @Body() role: Role) {
    await this._roleService.upodate(id, role);
  }
  @Delete(':id')
  async deleteRole(@Param('id', ParseIntPipe) id: number) {
    await this._roleService.delete(id);
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleRepository } from './role.repository';
import { Role } from '../role/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleRepository)
    private readonly _roleRepository: RoleRepository,
  ) {}

  async get(id: number): Promise<Role> {
    if (!id) {
      throw new BadRequestException('id is required');
    }
    const role: Role = await this._roleRepository.findOne(id, {
      where: { status: 'ACTIVE' },
    });
    if (!role) {
      throw new NotFoundException('role not found');
    }
    return role;
  }
  async getAll(): Promise<Role[]> {
    const roles: Role[] = await this._roleRepository.find({
      where: { status: 'ACTIVE' },
    });

    return roles;
  }
  async create(role: Role): Promise<Role> {
    const newRole: Role = await this._roleRepository.save(role);
    return newRole;
  }
  async upodate(id: number, role: Role): Promise<void> {
    await this._roleRepository.update(id, role);
  }
  async delete(id: number): Promise<void> {
    const roleExists: Role = await this._roleRepository.findOne(id, {
      where: { status: 'ACTIVE' },
    });
    if (!roleExists) {
      throw new NotFoundException('role not found');
    }
    await this._roleRepository.update(id, { status: 'INACTIVE' });
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { UserDetails } from './user.details.entity';
import { getConnection } from 'typeorm';
import { Role } from '../role/role.entity';
import { RoleType } from '../role/roletype.enum';
import { RoleRepository } from '../role/role.repository';
import { status } from '../../shared/entity-status.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly _userRepository: UserRepository,
    @InjectRepository(RoleRepository)
    private readonly _roleRepository: RoleRepository,
  ) {}

  async get(id: number): Promise<User> {
    if (!id) {
      throw new BadRequestException('id is required');
    }
    const user: User = await this._userRepository.findOne(id, {
      where: { status: status.ACTIVE },
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }
  async getAll(): Promise<User[]> {
    const users: User[] = await this._userRepository.find({
      where: { status: status.ACTIVE },
    });

    return users;
  }
  async create(user: User): Promise<User> {
    const details = new UserDetails();
    user.details = details;

    const roleRepo = await getConnection().getRepository(Role);
    const defaultRole = await roleRepo.findOne({
      where: { name: RoleType.GENERAL },
    });
    user.roles = [defaultRole];

    const newUser: User = await this._userRepository.save(user);
    return newUser;
  }
  async upodate(id: number, user: User): Promise<void> {
    await this._userRepository.update(id, user);
  }
  async delete(id: number): Promise<void> {
    const userExist: User = await this._userRepository.findOne(id, {
      where: { status: status.ACTIVE },
    });
    if (!userExist) {
      throw new NotFoundException('user not found');
    }
    await this._userRepository.update(id, { status: 'INACTIVE' });
  }
  async setRoleToUser(userId: number, roleId: number) {
    const userExist: User = await this._userRepository.findOne(userId, {
      where: { status: status.ACTIVE },
    });
    if (!userExist) {
      throw new NotFoundException('user not found');
    }
    const roleExist: Role = await this._roleRepository.findOne(roleId, {
      where: { status: status.ACTIVE },
    });
    if (!roleExist) {
      throw new NotFoundException('role not found');
    }
    userExist.roles = [...userExist.roles, roleExist];
    await this._userRepository.save(userExist);
    return true;
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { MapperService } from '../../shared/mapper.service';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';
import { UserDetails } from './user.details.entity';
import { getConnection } from 'typeorm';
import { Role } from '../role/role.entity';
import { RoleType } from '../role/roletype.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly _userRepository: UserRepository,
    private readonly _mapperService: MapperService,
  ) {}

  async get(id: number): Promise<UserDto> {
    if (!id) {
      throw new BadRequestException('id is required');
    }
    const user: User = await this._userRepository.findOne(id, {
      where: { status: 'ACTIVE' },
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this._mapperService.map<User, UserDto>(user, new UserDto());
  }
  async getAll(): Promise<UserDto[]> {
    const users: User[] = await this._userRepository.find({
      where: { status: 'ACTIVE' },
    });

    return this._mapperService.mapCollection<User, UserDto>(
      users,
      new UserDto(),
    );
  }
  async create(user: User): Promise<UserDto> {
    const details = new UserDetails();
    user.details = details;

    const roleRepo = await getConnection().getRepository(Role);
    const defaultRole = await roleRepo.findOne({
      where: { name: RoleType.GENERAL },
    });
    user.roles = [defaultRole];

    const newUser: User = await this._userRepository.save(user);
    return this._mapperService.map<User, UserDto>(newUser, new UserDto());
  }
  async upodate(id: number, user: User): Promise<void> {
    await this._userRepository.update(id, user);
  }
  async delete(id: number): Promise<void> {
    const userExists: User = await this._userRepository.findOne(id, {
      where: { status: 'ACTIVE' },
    });
    if (!userExists) {
      throw new NotFoundException('user not found');
    }
    await this._userRepository.update(id, { status: 'INACTIVE' });
  }
}

import { EntityRepository, getConnection, Repository } from 'typeorm';
import { Role } from '../role/role.entity';
import { RoleType } from '../role/roletype.enum';
import { User } from '../user/user.entity';
import { SignUpDto } from './dtos/signup.dto';
import { UserDetails } from '../user/user.details.entity';
import { genSalt, hash } from 'bcryptjs';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  async signup(signupDto: SignUpDto) {
    const { username, email, password } = signupDto;
    const user = new User();
    user.username = username;
    user.email = email;

    const roleRepository = await getConnection().getRepository(Role);
    const defaultRole = await roleRepository.findOne({
      where: { name: RoleType.GENERAL },
    });
    user.roles = [defaultRole];

    const details = new UserDetails();
    user.details = details;

    const salt = await genSalt(10);
    user.password = await hash(password, salt);
    await user.save();
  }
}

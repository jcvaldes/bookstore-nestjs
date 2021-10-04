import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SignUpDto } from './dtos/signup.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('signup')
  @UsePipes(ValidationPipe)
  async signup(@Body() signupDto: SignUpDto): Promise<void> {
    return this._authService.signup(signupDto);
  }

  @Post('signin')
  @UsePipes(ValidationPipe)
  async login(@Body() signinDto: SignInDto) {
    return this._authService.signin(signinDto);
  }
}

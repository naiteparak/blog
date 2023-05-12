import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';
import { CreateUserDto } from './users/dto/create-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AppController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: CreateUserDto): Promise<any> {
    return await this.authService.signup(body);
  }

  @Post('login')
  async login(@Body() body) {}
}

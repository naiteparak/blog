import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';
import { LoginDto, RefreshTokenDto, SignUpDto } from './auth/dto/auth.dto';
import { IdParamDto } from './common/dto/IdParamDto';
import { RefreshTokenGuard } from './auth/guards/refreshToken.guard';
import { Public } from './common/decorators/public.decorator';

@Public()
@ApiTags('Auth')
@Controller('auth')
export class AppController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: SignUpDto): Promise<any> {
    return await this.authService.signup(body);
  }

  @Post('login')
  async login(@Body() body: LoginDto): Promise<any> {
    return await this.authService.login(body);
  }

  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth()
  @Post('refresh')
  async refreshTokens(
    @Body() body: RefreshTokenDto,
    @Req() req: Request,
  ): Promise<any> {
    return await this.authService.refreshTokens(req, body);
  }
}

import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';
import {
  LoginDto,
  RefreshTokenDto,
  SignUpDto,
  TokensDTO,
} from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOkResponse({ type: TokensDTO })
  @ApiOperation({ summary: 'Sign Up' })
  @Public()
  @Post('signup')
  async signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }

  @ApiOkResponse({ type: TokensDTO })
  @ApiOperation({ summary: 'Log In' })
  @Public()
  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @ApiOkResponse({ type: TokensDTO })
  @ApiOperation({ summary: 'Refresh Tokens' })
  @ApiBearerAuth()
  @Post('refresh')
  async refreshTokens(@Req() req, @Body() body: RefreshTokenDto) {
    return this.authService.refreshTokens(req.author.login, body);
  }
}

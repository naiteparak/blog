import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthorsService } from '../authors/authors.service';
import { JwtService } from '@nestjs/jwt';
import {
  LoginDto,
  RefreshTokenDto,
  SignUpDto,
  TokensDTO,
} from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import { compare } from 'bcrypt';
import { AuthMessages } from './messages/auth.messages';

@Injectable()
export class AuthService {
  constructor(
    private authorsService: AuthorsService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(body: SignUpDto): Promise<TokensDTO> {
    const author = await this.authorsService.createAuthor(body);
    const payload = {
      username: body.username,
      login: body.login,
      sub: author.id,
    };

    const { accessToken, refreshToken } = await this.generateTokens(payload);
    await this.authorsService.updateToken(author.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(body: LoginDto): Promise<TokensDTO> {
    const author = await this.authorsService.findAuthorByLogin(body.login);
    const isPassValid = compare(body.password, author.password);

    if (isPassValid) {
      const payload = {
        username: author.username,
        login: body.login,
        sub: author.id,
      };

      const { accessToken, refreshToken } = await this.generateTokens(payload);
      await this.authorsService.updateToken(author.id, refreshToken);

      return {
        accessToken,
        refreshToken,
      };
    } else {
      throw new UnauthorizedException(AuthMessages.UNAUTHORIZED);
    }
  }

  async refreshTokens(login: string, body: RefreshTokenDto) {
    const author = await this.authorsService.findAuthorByLogin(login);

    if (body.refreshToken === author.refreshToken) {
      const payload = {
        username: author.username,
        login: author.login,
        sub: author.id,
      };
      const { accessToken, refreshToken } = await this.generateTokens(payload);
      await this.authorsService.updateToken(author.id, refreshToken);

      return {
        accessToken,
        refreshToken,
      };
    } else {
      throw new UnauthorizedException(AuthMessages.UNAUTHORIZED);
    }
  }

  private async generateTokens(payload): Promise<TokensDTO> {
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(
      {},
      {
        secret: this.configService.get('JWT_SECRET_REFRESH_KEY'),
        expiresIn: this.configService.get('TOKEN_REFRESH_EXPIRE_TIME'),
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}

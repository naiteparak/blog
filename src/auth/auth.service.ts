import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto, RefreshTokenDto, SignUpDto } from './dto/auth.dto';
import {
  CRYPT_SALT,
  JWT_SECRET_KEY,
  JWT_SECRET_REFRESH_KEY,
  TOKEN_EXPIRE_TIME,
  TOKEN_REFRESH_EXPIRE_TIME,
} from '../common/configs/config';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../users/entities/user.entity';
import { IdParamDto } from '../common/dto/IdParamDto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(body: SignUpDto): Promise<any> {
    try {
      const hashedPassword = await bcrypt.hash(body.password, CRYPT_SALT);
      const newUser = await this.usersService.createUser({
        ...body,
        password: hashedPassword,
      });
      const tokens = await this.getTokens(newUser);
      return { ...tokens, id: newUser.id };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async login(body: LoginDto): Promise<any> {
    //TODO rename all Promise<any>
    const user: UserEntity = await this.usersService.findUserByLogin(
      body.login,
    );
    if (!user) throw new BadRequestException('User does not exist');
    const passwordMatches = await bcrypt.compare(body.password, user.password);
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');
    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.login, tokens.refreshToken);
    return { ...tokens, id: user.id };
  }

  async refreshTokens(req, body: RefreshTokenDto): Promise<any> {
    const user = await this.usersService.findUserById(req.user);
    if (user.refreshToken !== body.refreshToken) {
      throw new ConflictException('Wrong refresh token');
    }
    return await this.getTokens(user);
  }

  async getTokens(user: UserEntity): Promise<any> {
    const payload = {
      accessToken: this.jwtService.sign(
        { id: user.id, login: user.login },
        {
          secret: JWT_SECRET_KEY,
          expiresIn: TOKEN_EXPIRE_TIME,
        },
      ),
      refreshToken: this.jwtService.sign(
        {},
        {
          secret: JWT_SECRET_REFRESH_KEY,
          expiresIn: TOKEN_REFRESH_EXPIRE_TIME,
        },
      ),
    };
    await this.updateRefreshToken(user.login, payload.refreshToken);
    return payload;
  }

  async updateRefreshToken(login: string, token: string): Promise<any> {
    const user = await this.usersService.findUserByLogin(login);
    await this.usersService.updateToken(
      { id: user.id },
      { ...user, refreshToken: token },
    );
  }
}

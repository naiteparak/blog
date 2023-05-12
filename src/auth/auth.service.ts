import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import {
  CRYPT_SALT,
  JWT_SECRET_KEY,
  JWT_SECRET_REFRESH_KEY,
  TOKEN_EXPIRE_TIME,
  TOKEN_REFRESH_EXPIRE_TIME,
} from '../../common/configs/config';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(body: CreateUserDto): Promise<any> {
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
    await this.refreshToken(user.login, payload.refreshToken);
    return payload;
  }

  async refreshToken(login: string, token: string): Promise<any> {
    const user = await this.usersService.findUserByLogin(login);
    await this.usersService.updateToken(
      { id: user.id },
      { ...user, refreshToken: token },
    );
  }
}

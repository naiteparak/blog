import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { IdParamDto } from '../common/dto/IdParamDto';
import { SignUpDto } from '../auth/dto/auth.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async createUser(body: SignUpDto): Promise<UserEntity> {
    const user: UserEntity = await this.usersRepository.create({
      id: crypto.randomUUID(),
      ...body,
      createdAt: Date.now(),
    });
    return await this.usersRepository.save(user);
  }

  async findUserByLogin(params: string): Promise<any> {
    return await this.usersRepository.findOneBy({ login: params });
  }

  async findUserById(params: IdParamDto): Promise<any> {
    return await this.usersRepository.findOneBy({ id: params.id });
  }

  async updateToken(params: IdParamDto, body): Promise<any> {
    await this.usersRepository.update(
      { id: params.id },
      {
        refreshToken: body.refreshToken,
      },
    );
  }
}

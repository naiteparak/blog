import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { IdParamDto } from '../../common/dto/IdParamDto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async createUser(body: CreateUserDto): Promise<UserEntity> {
    const user: UserEntity = await this.usersRepository.create({
      id: crypto.randomUUID(),
      ...body,
      createdAt: Date.now(),
    });
    return await this.usersRepository.save(user);
  }

  async findUserByLogin(params: string) {
    return await this.usersRepository.findOneBy({ login: params });
  }

  async updateToken(params: IdParamDto, body) {
    await this.usersRepository.update(
      { id: params.id },
      {
        refreshToken: body.refreshToken,
      },
    );
  }
}

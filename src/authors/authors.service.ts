import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorsEntity } from './entities/authors.entity';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { SignUpDto } from '../auth/dto/auth.dto';
import { hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthorsService {
  private readonly CRYPT_SALT;

  constructor(
    @InjectRepository(AuthorsEntity)
    private authorsRepository: Repository<AuthorsEntity>,
    private configService: ConfigService,
  ) {
    this.CRYPT_SALT = +this.configService.get('CRYPT_SALT');
  }

  async createAuthor(body: SignUpDto): Promise<AuthorsEntity> {
    try {
      const author: AuthorsEntity = await this.authorsRepository.create({
        ...body,
        id: randomUUID(),
        createdAt: Date.now(),
        password: await hash(body.password, this.CRYPT_SALT),
      });
      return await this.authorsRepository.save(author);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username or login already exists');
      } else {
        throw error;
      }
    }
  }

  async findAuthorByLogin(login: string): Promise<AuthorsEntity> {
    return await this.authorsRepository.findOneByOrFail({ login });
  }

  async findAuthorById(id: string): Promise<AuthorsEntity> {
    return await this.authorsRepository.findOneBy({ id });
  }

  async updateToken(id: string, token: string): Promise<void> {
    await this.authorsRepository.update({ id }, { refreshToken: token });
  }
}

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorsEntity } from './entities/authors.entity';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { SignUpDto } from '../auth/dto/auth.dto';
import { AuthorsMessages } from './messages/authors.messages';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(AuthorsEntity)
    private authorsRepository: Repository<AuthorsEntity>,
  ) {}

  async createAuthor(body: SignUpDto): Promise<AuthorsEntity> {
    try {
      const author: AuthorsEntity = await this.authorsRepository.create({
        ...body,
        id: randomUUID(),
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
    try {
      return await this.authorsRepository.findOneOrFail({
        where: { login },
      });
    } catch (error) {
      throw new NotFoundException(AuthorsMessages.AUTHOR_NOT_FOUND);
    }
  }

  async updateToken(id: string, token: string): Promise<void> {
    await this.authorsRepository.update({ id }, { refreshToken: token });
  }
}

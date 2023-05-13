import { Module } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsEntity } from './entities/authors.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AuthorsEntity])],
  providers: [AuthorsService],
  exports: [AuthorsService],
})
export class AuthorsModule {}

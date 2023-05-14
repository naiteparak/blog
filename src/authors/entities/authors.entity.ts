import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { hash } from 'bcrypt';

@Entity('authors')
export class AuthorsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { unique: true })
  login: string;

  @Exclude()
  @Column('varchar')
  password: string;

  @Column('varchar', { unique: true })
  username: string;

  @CreateDateColumn()
  createdAt: string;

  @Exclude()
  @Column({ nullable: true })
  refreshToken: string | null;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, +process.env.CRYPT_SALT);
  }
}

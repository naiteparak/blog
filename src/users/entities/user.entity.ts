import { Entity, Column, PrimaryGeneratedColumn, AfterLoad } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { unique: true })
  login: string;

  @Exclude()
  @Column('varchar')
  password: string;

  @Column('varchar', { unique: true })
  username: string;

  @Column('int8')
  createdAt: number;

  @Exclude()
  @Column({ nullable: true })
  refreshToken: string | null;

  @AfterLoad()
  _convertNumerics() {
    this.createdAt = +this.createdAt;
  }
}

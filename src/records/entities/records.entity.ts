import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterLoad,
  ManyToOne,
} from 'typeorm';
import { AuthorsEntity } from '../../authors/entities/authors.entity';

@Entity('records')
export class RecordsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: true })
  message: string | null;

  @Column('varchar', { nullable: true })
  fileName: string | null;

  @Column('int8')
  createdAt: number;

  @Column('int8')
  updatedAt: number;

  @Column('boolean', { default: false })
  deleted: boolean;

  @Column()
  authorId: string;

  @ManyToOne(() => AuthorsEntity)
  author: AuthorsEntity;

  @AfterLoad()
  _convertNumerics() {
    this.createdAt = +this.createdAt;
    this.updatedAt = +this.updatedAt;
  }
}

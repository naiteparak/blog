import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
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

  @CreateDateColumn()
  createdAt: number;

  @UpdateDateColumn()
  updatedAt: number;

  @Column('boolean', { default: false })
  deleted: boolean;

  @Column()
  authorId: string;

  @ManyToOne(() => AuthorsEntity)
  author: AuthorsEntity;
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { Allow } from 'class-validator';

@Entity()
export class PostEntity extends BaseEntity {
  @Allow()
  @PrimaryGeneratedColumn()
  id: number;

  @Allow()
  @Column({ length: 684, nullable: false })
  title: string;

  @Allow()
  @Column({ length: 100, default: '' })
  description: string;

  @Allow()
  @Column({ length: 256, default: '' })
  link: string;
}

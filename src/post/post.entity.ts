import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Allow } from 'class-validator';
import { User } from 'src/user/user.entity';

@Entity()
export class Post extends BaseEntity {
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

  @ManyToOne(() => User, (user) => user.posts)
  owner: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

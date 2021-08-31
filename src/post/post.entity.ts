import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Allow } from 'class-validator';
import { User } from '../user/user.entity';
import { StoredElement } from '../stored-element/stored-element.entity';

@Entity()
export class Post extends BaseEntity {
  @Allow()
  @PrimaryGeneratedColumn()
  id: number;

  @Allow()
  @Column({ length: 684, nullable: false })
  title: string;

  @Allow()
  @Column({ type: 'text' })
  description: string;

  @Allow()
  @Column({ length: 256, nullable: true })
  link: string;

  @ManyToOne(() => User, (user) => user.posts)
  owner: User;

  @OneToOne(() => StoredElement)
  @JoinColumn()
  thumbnail: StoredElement;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Allow } from 'class-validator';
import { Post } from '../post/post.entity';

@Entity()
export class StoredElement extends BaseEntity {
  @Allow()
  @PrimaryGeneratedColumn()
  id: number;

  @Allow()
  @Column({ length: 684, nullable: false })
  name: string;

  @Allow()
  @Column({ length: 684 })
  type: string;

  @Allow()
  @Column({ length: 3096 })
  location: string;

  // @OneToOne(() => Post, (post) => post.thumbnail)
  // post: Post;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

import { Post as httpPost } from '@nestjs/common';
import { Post } from 'src/post/post.entity';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    nullable: false,
    select: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  email: string;

  @OneToMany(() => Post, (post) => post.owner)
  posts: Post[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

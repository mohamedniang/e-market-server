import { Link } from 'src/link/link.entity';
import { Post } from 'src/post/post.entity';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
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

  @OneToMany(() => Link, (link) => link.account)
  links: Link[];

  @Column({ default: false, select: false })
  isVerified: boolean;

  @Column({ default: '' })
  fullname: string;

  @Column({ default: '' })
  company: string;

  @Column({ default: '' })
  address: string;

  @Column({ default: '' })
  country: string;

  @Column({ default: '' })
  city: string;

  @Column({ default: '' })
  state: string;

  @Column({ default: '' })
  phone: string;

  @Column({ default: '' })
  fax: string;

  @Column({ default: '' })
  website: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  // @BeforeInsert()
  // @BeforeUpdate()
  // async formatUsername() {
  //   this.username = this.username.trim().split(' ').join('_');
  // }

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;
}

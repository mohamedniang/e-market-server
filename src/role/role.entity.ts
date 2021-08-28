import { Allow } from 'class-validator';
import { User } from 'src/user/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('role')
export class Role extends BaseEntity {
  @Allow()
  @PrimaryGeneratedColumn()
  id: number;

  @Allow()
  @Column({
    type: 'varchar',
    nullable: false,
    // unique: true,
  })
  name: string;

  @Allow()
  @OneToMany((type) => User, (user) => user.role, { cascade: true })
  users: User[];
}

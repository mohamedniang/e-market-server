import { User } from 'src/user/user.entity';
import {
  Entity,
  BaseEntity,
  TableInheritance,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Link extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column({ default: true })
  isValid: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  resend_date: Date;

  @ManyToOne(() => User, (item) => item.links)
  // @JoinColumn()
  account: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

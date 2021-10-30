import { EmailService } from 'src/email/email.service';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('contact')
export class Contact extends BaseEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  email: string;

  @Column({ default: '' })
  firstname: string;
  @Column({ default: '' })
  lastname: string;
  @Column({ default: '' })
  phone: string;
  @Column({ default: '' })
  message: string;

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;
}

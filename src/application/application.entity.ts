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

export class Reference {
  @Column({ default: '' })
  reference1: string;
  @Column({ default: '' })
  reference2: string;
  @Column({ default: '' })
  reference3: string;
}

export class Address {
  @Column({ default: '' })
  city: string;
  @Column({ default: '' })
  country: string;
  @Column({ default: '' })
  full: string;
  @Column({ default: '' })
  postalCode: string;
  @Column({ default: '' })
  state: string;
}

@Entity('application')
export class Application extends BaseEntity {
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
  @Column((type) => Address)
  address: Address;
  @Column({ default: '' })
  comment: string;
  @Column({ default: '' })
  company: string;
  @Column({ default: 0 })
  employees: number;
  @Column({ default: '' })
  introduction: string;
  @Column({ default: '' })
  phone: string;
  @Column((type) => Reference)
  references: Reference;
  @Column({ default: '' })
  type: string;
  @Column({ default: '' })
  username: string;
  @Column({ default: '' })
  website: string;
  @Column({ default: 2021 })
  year: number;

  @Column({ default: false })
  isAccepted: boolean;

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
  OneToMany,
  Index,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Allow } from 'class-validator';
import { User } from '../user/user.entity';
import { StoredElement } from 'src/stored-element/stored-element.entity';

export enum Box {
  INBOX = 'inbox',
  OUTBOX = 'outbox',
  DELETED = 'deleted',
}

@Entity()
export class Email extends BaseEntity {
  @Allow()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: Box,
    default: Box.INBOX,
  })
  box: Box;

  @Allow()
  @Column({ type: 'json', nullable: true })
  from: any;

  @Allow()
  @Column({ type: 'json', nullable: true })
  to: any;

  @Allow()
  @Column({ type: 'json', nullable: true })
  cc: any;

  @Allow()
  @Column({ type: 'json', nullable: true })
  bcc: any;

  // @Allow()
  // @Column({ nullable: true })
  // recipientId: number;

  // @Allow()
  // @ManyToOne((type) => User, (user) => user.receivedMails)
  // recipient: User;

  @Allow()
  @Column({ default: false })
  read: boolean;

  // @Allow()
  // @ManyToOne((type) => User, (user) => user.sentMails)
  // author: User;

  @Allow()
  @Column({ default: '', length: 1024 })
  subject: string;

  @Allow()
  @Column({ type: 'text', nullable: true })
  text: string;

  @Allow()
  @Column({ type: 'text', nullable: true })
  textAsHtml: string;

  @Allow()
  @Column({ type: 'text', nullable: true })
  html: string;

  // @ManyToMany((type) => StoredElement)
  // @JoinTable()
  // attachments: StoredElement[];

  @Allow()
  @Column({ nullable: true })
  messageId: string;

  @Allow()
  @Column({ nullable: true })
  inReplyTo: string;

  @Index()
  @CreateDateColumn()
  creationDate: Date;
}

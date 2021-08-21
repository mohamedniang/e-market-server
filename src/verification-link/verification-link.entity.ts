import { User } from 'src/user/user.entity';
import { ChildEntity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Link } from '../link/link.entity';

@ChildEntity()
export class VerificationLink extends Link {}

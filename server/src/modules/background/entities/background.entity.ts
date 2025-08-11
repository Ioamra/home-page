import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserAccount } from '../../user-account/entities/user-account.entity';

@Entity('background')
export class Background {
  @PrimaryGeneratedColumn()
  id_background: number;

  @Column()
  image: string;

  @ManyToOne(() => UserAccount, (u) => u.backgrounds, { onDelete: 'CASCADE' })
  user_account: UserAccount;
}

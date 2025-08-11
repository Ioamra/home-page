import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserAccount } from '../../user-account/entities/user-account.entity';

@Entity('link')
export class Link {
  @PrimaryGeneratedColumn()
  id_link: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  image: string;

  @Column()
  url: string;

  @ManyToOne(() => UserAccount, (u) => u.links, { onDelete: 'CASCADE' })
  user_account: UserAccount;
}

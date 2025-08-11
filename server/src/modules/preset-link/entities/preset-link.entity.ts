import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserAccount } from '../../user-account/entities/user-account.entity';

@Entity('preset_link')
export class PresetLink {
  @PrimaryGeneratedColumn()
  id_preset_link: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  image: string;

  @Column()
  url: string;

  @ManyToMany(() => UserAccount, (u) => u.preset_links)
  user_accounts: UserAccount[];
}

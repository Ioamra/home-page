import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserAccount } from '../../user-account/entities/user-account.entity';

@Entity('preset_background')
export class PresetBackground {
  @PrimaryGeneratedColumn()
  id_preset_background: string;

  @Column()
  image: string;

  @ManyToMany(() => UserAccount, (u) => u.preset_backgrounds)
  user_accounts: UserAccount[];
}

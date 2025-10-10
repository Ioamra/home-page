import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserAccount } from '../../user-account/entities/user-account.entity';
import { PresetDork } from './preset-dork.entity';
import { PresetQueryParam } from './preset-query-param.entity';

@Entity('preset_search_bar')
export class PresetSearchBar {
  @PrimaryGeneratedColumn()
  id_preset_search_bar: string;

  @Column({ nullable: true })
  image: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  placeholder: string;

  @Column({ default: true })
  is_search_query_param: boolean;

  @Column({ nullable: true })
  query_param_key: string;

  @ManyToMany(() => UserAccount, (u) => u.preset_search_bars)
  user_accounts: UserAccount[];

  @OneToMany(() => PresetQueryParam, (qp) => qp.preset_search_bar)
  query_params: PresetQueryParam[];

  @OneToMany(() => PresetDork, (d) => d.preset_search_bar)
  dorks: PresetDork[];
}

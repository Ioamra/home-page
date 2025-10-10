import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserAccount } from '../../user-account/entities/user-account.entity';
import { Dork } from './dork.entity';
import { QueryParam } from './query-param.entity';

@Entity('search_bar')
export class SearchBar {
  @PrimaryGeneratedColumn()
  id_search_bar: string;

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

  @ManyToOne(() => UserAccount, (u) => u.search_bars, { onDelete: 'CASCADE' })
  user_account: UserAccount;

  @OneToMany(() => QueryParam, (qp) => qp.search_bar)
  query_params: QueryParam[];

  @OneToMany(() => Dork, (d) => d.search_bar)
  dorks: Dork[];
}

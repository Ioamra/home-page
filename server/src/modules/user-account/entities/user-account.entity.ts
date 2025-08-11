import { Background } from 'src/modules/background/entities/background.entity';
import { Link } from 'src/modules/link/entities/link.entity';
import { PresetBackground } from 'src/modules/preset-background/entities/preset-background.entity';
import { PresetLink } from 'src/modules/preset-link/entities/preset-link.entity';
import { PresetSearchBar } from 'src/modules/preset-search-bar/entities/preset-search-bar.entity';
import { SearchBar } from 'src/modules/search-bar/entities/search-bar.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_account', { schema: 'public' })
export class UserAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('character varying', { unique: true })
  email: string;

  @Column('character varying', { length: 60 })
  password: string;

  @Column('character varying')
  photo: string;

  @Column('boolean', { default: false })
  is_admin: boolean;

  @Column('character varying', { nullable: true })
  verification_code: string;

  @Column('timestamp without time zone', { nullable: true })
  verification_date: Date | null;

  @Column('timestamp without time zone', { default: 'NOW()' })
  created_at: Date;

  @OneToMany(() => Background, (b) => b.user_account)
  backgrounds: Background[];

  @OneToMany(() => SearchBar, (sb) => sb.user_account)
  search_bars: SearchBar[];

  @OneToMany(() => Link, (l) => l.user_account)
  links: Link[];

  @ManyToMany(() => PresetBackground, (pb) => pb.user_accounts)
  @JoinTable({ name: 'user_account_has_preset_background' })
  preset_backgrounds: PresetBackground[];

  @ManyToMany(() => PresetLink, (pl) => pl.user_accounts)
  @JoinTable({ name: 'user_account_has_preset_link' })
  preset_links: PresetLink[];

  @ManyToMany(() => PresetSearchBar, (psb) => psb.user_accounts)
  @JoinTable({ name: 'user_account_has_preset_search_bar' })
  preset_search_bars: PresetSearchBar[];
}

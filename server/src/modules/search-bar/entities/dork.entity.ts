import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SearchBar } from './search-bar.entity';

@Entity('dork')
export class Dork {
  @PrimaryGeneratedColumn()
  id_dork: string;

  @Column()
  label: string;

  @Column()
  entry: string;

  @ManyToOne(() => SearchBar, (sb) => sb.dorks, { onDelete: 'CASCADE' })
  search_bar: SearchBar;
}

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SearchBar } from './search-bar.entity';

@Entity('query_param')
export class QueryParam {
  @PrimaryGeneratedColumn()
  id_query_param: string;

  @Column()
  label: string;

  @Column()
  entry: string;

  @ManyToOne(() => SearchBar, (sb) => sb.query_params, { onDelete: 'CASCADE' })
  search_bar: SearchBar;
}

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PresetSearchBar } from './preset-search-bar.entity';

@Entity('preset_query_param')
export class PresetQueryParam {
  @PrimaryGeneratedColumn()
  id_preset_query_param: string;

  @Column()
  label: string;

  @Column()
  entry: string;

  @ManyToOne(() => PresetSearchBar, (psb) => psb.query_params, { onDelete: 'CASCADE' })
  preset_search_bar: PresetSearchBar;
}

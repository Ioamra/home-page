import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PresetSearchBar } from './preset-search-bar.entity';

@Entity('preset_dork')
export class PresetDork {
  @PrimaryGeneratedColumn()
  id_preset_dork: string;

  @Column()
  label: string;

  @Column()
  entry: string;

  @ManyToOne(() => PresetSearchBar, (psb) => psb.dorks, { onDelete: 'CASCADE' })
  preset_search_bar: PresetSearchBar;
}

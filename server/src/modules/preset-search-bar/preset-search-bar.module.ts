import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PresetDork } from './entities/preset-dork.entity';
import { PresetQueryParam } from './entities/preset-query-param.entity';
import { PresetSearchBar } from './entities/preset-search-bar.entity';
import { PresetSearchBarController } from './preset-search-bar.controller';
import { PresetSearchBarService } from './preset-search-bar.service';

@Module({
  imports: [TypeOrmModule.forFeature([PresetSearchBar, PresetDork, PresetQueryParam])],
  controllers: [PresetSearchBarController],
  providers: [PresetSearchBarService],
})
export class PresetSearchBarModule {}

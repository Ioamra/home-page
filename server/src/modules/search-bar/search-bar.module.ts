import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccount } from '../user-account/entities/user-account.entity';
import { Dork } from './entities/dork.entity';
import { QueryParam } from './entities/query-param.entity';
import { SearchBar } from './entities/search-bar.entity';
import { SearchBarController } from './search-bar.controller';
import { SearchBarService } from './search-bar.service';

@Module({
  imports: [TypeOrmModule.forFeature([SearchBar, UserAccount, Dork, QueryParam])],
  controllers: [SearchBarController],
  providers: [SearchBarService],
})
export class SearchBarModule {}

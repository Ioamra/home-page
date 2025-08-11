import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccount } from '../user-account/entities/user-account.entity';
import { Link } from './entities/link.entity';
import { LinkController } from './link.controller';
import { LinkService } from './link.service';

@Module({
  imports: [TypeOrmModule.forFeature([Link, UserAccount])],
  controllers: [LinkController],
  providers: [LinkService],
})
export class LinkModule {}

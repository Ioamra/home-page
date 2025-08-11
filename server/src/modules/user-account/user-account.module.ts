import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccount } from './entities/user-account.entity';
import { UserAccountController } from './user-account.controller';
import { UserAccountService } from './user-account.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserAccount]), JwtModule],
  controllers: [UserAccountController],
  providers: [UserAccountService],
  exports: [UserAccountService],
})
export class UserAccountModule {}

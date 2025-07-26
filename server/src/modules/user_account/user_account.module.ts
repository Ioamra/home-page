import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccount } from './entities/user_account.entity';
import { UserAccountController } from './user_account.controller';
import { UserAccountService } from './user_account.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserAccount]), JwtModule],
  controllers: [UserAccountController],
  providers: [UserAccountService],
  exports: [UserAccountService],
})
export class UserAccountModule {}

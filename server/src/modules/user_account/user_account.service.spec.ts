import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserAccount } from './entities/user_account.entity';
import { UserAccountService } from './user_account.service';

describe('UserAccountService', () => {
  let service: UserAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserAccountService,
        { provide: ConfigService, useValue: {} },
        {
          provide: getRepositoryToken(UserAccount),
          useValue: { findOne: jest.fn(), save: jest.fn(), update: jest.fn(), delete: jest.fn(), find: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<UserAccountService>(UserAccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { SearchBarController } from './search-bar.controller';
import { SearchBarService } from './search-bar.service';

describe('SearchBarController', () => {
  let controller: SearchBarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchBarController],
      providers: [SearchBarService],
    }).compile();

    controller = module.get<SearchBarController>(SearchBarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

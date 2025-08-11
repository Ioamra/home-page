import { Test, TestingModule } from '@nestjs/testing';
import { PresetSearchBarService } from './preset-search-bar.service';

describe('PresetSearchBarService', () => {
  let service: PresetSearchBarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PresetSearchBarService],
    }).compile();

    service = module.get<PresetSearchBarService>(PresetSearchBarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { PresetLinkService } from './preset-link.service';

describe('PresetLinkService', () => {
  let service: PresetLinkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PresetLinkService],
    }).compile();

    service = module.get<PresetLinkService>(PresetLinkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

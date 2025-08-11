import { Test, TestingModule } from '@nestjs/testing';
import { PresetBackgroundService } from './preset-background.service';

describe('PresetBackgroundService', () => {
  let service: PresetBackgroundService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PresetBackgroundService],
    }).compile();

    service = module.get<PresetBackgroundService>(PresetBackgroundService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

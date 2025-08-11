import { MemoryStorageFile } from '@blazity/nest-file-fastify';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreatePresetBackgroundDto } from './dto/create-preset-background.dto';
import { UpdatePresetBackgroundDto } from './dto/update-preset-background.dto';
import { PresetBackground } from './entities/preset-background.entity';

@Injectable()
export class PresetBackgroundService {
  constructor(
    @InjectRepository(PresetBackground)
    private readonly presetBackgroundRepository: Repository<PresetBackground>,
  ) {}

  public async create(createPresetBackgroundDto: CreatePresetBackgroundDto, image?: MemoryStorageFile): Promise<PresetBackground> {
    const presetBackground = await this.presetBackgroundRepository.save({
      ...createPresetBackgroundDto,
      image: 'default-preset-background.jpg', // default value
    });

    if (image) {
      const ext = image.mimetype.split('/')[1];
      const fileName = `${presetBackground.id_preset_background}.${ext}`;
      await this.presetBackgroundRepository.update(presetBackground.id_preset_background, { image: fileName });

      const uploadPath = path.join(__dirname, `../../../upload/preset-background`, fileName);
      if (!fs.existsSync(path.dirname(uploadPath))) {
        fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
      }
      fs.writeFileSync(uploadPath, image.buffer);
    }

    return presetBackground;
  }

  public async findAll(): Promise<PresetBackground[]> {
    return this.presetBackgroundRepository.find();
  }

  public async update(id: string, updatePresetBackgroundDto: UpdatePresetBackgroundDto, image?: MemoryStorageFile): Promise<UpdateResult> {
    const presetBackground = await this.presetBackgroundRepository.findOne({ where: { id_preset_background: id } });
    if (!presetBackground) {
      throw new Error('PresetBackground not found');
    }

    if (image) {
      // Delete old image if exists
      if (presetBackground.image && !presetBackground.image.startsWith('default')) {
        const oldImagePath = path.join(__dirname, `../../../upload/preset-background`, presetBackground.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Save new image
      const ext = image.mimetype.split('/')[1];
      const fileName = `${id}.${ext}`;
      const uploadPath = path.join(__dirname, `../../../upload/preset-background`, fileName);
      fs.writeFileSync(uploadPath, image.buffer);

      (updatePresetBackgroundDto as UpdatePresetBackgroundDto & { image?: string }).image = fileName;
    }

    return this.presetBackgroundRepository.update(id, updatePresetBackgroundDto);
  }

  public async remove(id: string): Promise<DeleteResult> {
    const presetBackground = await this.presetBackgroundRepository.findOne({ where: { id_preset_background: id } });
    if (presetBackground?.image && !presetBackground.image.startsWith('default')) {
      const imagePath = path.join(__dirname, `../../../upload/preset-background`, presetBackground.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    return this.presetBackgroundRepository.delete(id);
  }
}

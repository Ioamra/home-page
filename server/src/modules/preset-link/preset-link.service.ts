import { MemoryStorageFile } from '@blazity/nest-file-fastify';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreatePresetLinkDto } from './dto/create-preset-link.dto';
import { UpdatePresetLinkDto } from './dto/update-preset-link.dto';
import { PresetLink } from './entities/preset-link.entity';

@Injectable()
export class PresetLinkService {
  constructor(
    @InjectRepository(PresetLink)
    private readonly presetLinkRepository: Repository<PresetLink>,
  ) {}

  public async create(createPresetLinkDto: CreatePresetLinkDto, image?: MemoryStorageFile): Promise<PresetLink> {
    const presetLink = await this.presetLinkRepository.save({
      ...createPresetLinkDto,
      image: null, // default value
    });

    if (image) {
      const ext = image.mimetype.split('/')[1];
      const fileName = `${presetLink.id_preset_link}.${ext}`;
      await this.presetLinkRepository.update(presetLink.id_preset_link, { image: fileName });

      const uploadPath = path.join(__dirname, `../../../upload/preset-link`, fileName);
      if (!fs.existsSync(path.dirname(uploadPath))) {
        fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
      }
      fs.writeFileSync(uploadPath, image.buffer);
    }

    return presetLink;
  }

  public async findAll(): Promise<PresetLink[]> {
    return this.presetLinkRepository.find();
  }

  public async update(id: string, updatePresetLinkDto: UpdatePresetLinkDto, image?: MemoryStorageFile): Promise<UpdateResult> {
    const presetLink = await this.presetLinkRepository.findOne({ where: { id_preset_link: id } });
    if (!presetLink) {
      throw new Error('PresetLink not found');
    }

    if (image) {
      // Delete old image if exists
      if (presetLink.image) {
        const oldImagePath = path.join(__dirname, `../../../upload/preset-link`, presetLink.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Save new image
      const ext = image.mimetype.split('/')[1];
      const fileName = `${id}.${ext}`;
      const uploadPath = path.join(__dirname, `../../../upload/preset-link`, fileName);
      fs.writeFileSync(uploadPath, image.buffer);

      (updatePresetLinkDto as UpdatePresetLinkDto & { image?: string }).image = fileName;
    }

    return this.presetLinkRepository.update(id, updatePresetLinkDto);
  }

  public async remove(id: string): Promise<DeleteResult> {
    const presetLink = await this.presetLinkRepository.findOne({ where: { id_preset_link: id } });
    if (presetLink?.image) {
      const imagePath = path.join(__dirname, `../../../upload/preset-link`, presetLink.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    return this.presetLinkRepository.delete(id);
  }
}

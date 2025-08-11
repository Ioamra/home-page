import { MemoryStorageFile } from '@blazity/nest-file-fastify';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreatePresetSearchBarDto } from './dto/create-preset-search-bar.dto';
import { UpdatePresetSearchBarDto } from './dto/update-preset-search-bar.dto';
import { PresetDork } from './entities/preset-dork.entity';
import { PresetQueryParam } from './entities/preset-query-param.entity';
import { PresetSearchBar } from './entities/preset-search-bar.entity';

@Injectable()
export class PresetSearchBarService {
  constructor(
    @InjectRepository(PresetSearchBar)
    private readonly presetSearchBarRepository: Repository<PresetSearchBar>,
    @InjectRepository(PresetDork)
    private readonly presetDorkRepository: Repository<PresetDork>,
    @InjectRepository(PresetQueryParam)
    private readonly presetQueryParamRepository: Repository<PresetQueryParam>,
  ) {}

  public async create(createPresetSearchBarDto: CreatePresetSearchBarDto, image?: MemoryStorageFile): Promise<PresetSearchBar> {
    // Créer la preset search bar sans les relations
    const presetSearchBarData = {
      url: createPresetSearchBarDto.url,
      placeholder: createPresetSearchBarDto.placeholder,
      image: null, // default value
    };

    const presetSearchBar = await this.presetSearchBarRepository.save(presetSearchBarData);

    // Gérer l'upload de l'image
    if (image) {
      const ext = image.mimetype.split('/')[1];
      const fileName = `${presetSearchBar.id_preset_search_bar}.${ext}`;
      await this.presetSearchBarRepository.update(presetSearchBar.id_preset_search_bar, { image: fileName });

      const uploadPath = path.join(__dirname, `../../../upload/preset-search-bar`, fileName);
      if (!fs.existsSync(path.dirname(uploadPath))) {
        fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
      }
      fs.writeFileSync(uploadPath, image.buffer);
    }

    // Créer les dorks associés
    if (createPresetSearchBarDto.dorks && createPresetSearchBarDto.dorks.length > 0) {
      const dorks = createPresetSearchBarDto.dorks.map((dork) => ({
        ...dork,
        preset_search_bar: presetSearchBar,
      }));
      await this.presetDorkRepository.save(dorks);
    }

    // Créer les query_params associés
    if (createPresetSearchBarDto.query_params && createPresetSearchBarDto.query_params.length > 0) {
      const queryParams = createPresetSearchBarDto.query_params.map((queryParam) => ({
        ...queryParam,
        preset_search_bar: presetSearchBar,
      }));
      await this.presetQueryParamRepository.save(queryParams);
    }

    // Retourner la preset search bar avec ses relations
    return this.presetSearchBarRepository.findOne({
      where: { id_preset_search_bar: presetSearchBar.id_preset_search_bar },
      relations: ['dorks', 'query_params'],
    });
  }

  public async findAll(): Promise<PresetSearchBar[]> {
    return this.presetSearchBarRepository.find({
      relations: ['query_params', 'dorks'],
    });
  }

  public async update(id: string, updatePresetSearchBarDto: UpdatePresetSearchBarDto, image?: MemoryStorageFile): Promise<UpdateResult> {
    const presetSearchBar = await this.presetSearchBarRepository.findOne({ where: { id_preset_search_bar: id } });
    if (!presetSearchBar) {
      throw new Error('PresetSearchBar not found');
    }

    if (image) {
      // Delete old image if exists
      if (presetSearchBar.image) {
        const oldImagePath = path.join(__dirname, `../../../upload/preset-search-bar`, presetSearchBar.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Save new image
      const ext = image.mimetype.split('/')[1];
      const fileName = `${id}.${ext}`;
      const uploadPath = path.join(__dirname, `../../../upload/preset-search-bar`, fileName);
      fs.writeFileSync(uploadPath, image.buffer);

      (updatePresetSearchBarDto as UpdatePresetSearchBarDto & { image?: string }).image = fileName;
    }

    return this.presetSearchBarRepository.update(id, updatePresetSearchBarDto);
  }

  public async remove(id: string): Promise<DeleteResult> {
    const presetSearchBar = await this.presetSearchBarRepository.findOne({ where: { id_preset_search_bar: id } });
    if (presetSearchBar?.image) {
      const imagePath = path.join(__dirname, `../../../upload/preset-search-bar`, presetSearchBar.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    return this.presetSearchBarRepository.delete(id);
  }
}

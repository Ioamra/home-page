import { MemoryStorageFile } from '@blazity/nest-file-fastify';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserAccount } from '../user-account/entities/user-account.entity';
import { CreateSearchBarDto } from './dto/create-search-bar.dto';
import { UpdateSearchBarDto } from './dto/update-search-bar.dto';
import { Dork } from './entities/dork.entity';
import { QueryParam } from './entities/query-param.entity';
import { SearchBar } from './entities/search-bar.entity';

@Injectable()
export class SearchBarService {
  constructor(
    @InjectRepository(SearchBar)
    private readonly searchBarRepository: Repository<SearchBar>,
    @InjectRepository(UserAccount)
    private readonly userAccountRepository: Repository<UserAccount>,
    @InjectRepository(Dork)
    private readonly dorkRepository: Repository<Dork>,
    @InjectRepository(QueryParam)
    private readonly queryParamRepository: Repository<QueryParam>,
  ) {}

  public async create(userId: number, createSearchBarDto: CreateSearchBarDto, image?: MemoryStorageFile): Promise<SearchBar> {
    const userAccount = await this.userAccountRepository.findOne({ where: { id: userId } });
    if (!userAccount) {
      throw new Error('User not found');
    }

    // Créer la search bar sans les relations
    const searchBarData = {
      url: createSearchBarDto.url,
      placeholder: createSearchBarDto.placeholder,
      user_account: userAccount,
      image: null, // default value
    };

    const searchBar = await this.searchBarRepository.save(searchBarData);

    // Gérer l'upload de l'image
    if (image) {
      const ext = image.mimetype.split('/')[1];
      const fileName = `${searchBar.id_search_bar}.${ext}`;
      await this.searchBarRepository.update(searchBar.id_search_bar, { image: fileName });

      const uploadPath = path.join(__dirname, `../../../upload/search-bar`, fileName);
      if (!fs.existsSync(path.dirname(uploadPath))) {
        fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
      }
      fs.writeFileSync(uploadPath, image.buffer);
    }

    // Créer les dorks associés
    if (createSearchBarDto.dorks && createSearchBarDto.dorks.length > 0) {
      const dorks = createSearchBarDto.dorks.map((dork) => ({
        ...dork,
        search_bar: searchBar,
      }));
      await this.dorkRepository.save(dorks);
    }

    // Créer les query_params associés
    if (createSearchBarDto.query_params && createSearchBarDto.query_params.length > 0) {
      const queryParams = createSearchBarDto.query_params.map((queryParam) => ({
        ...queryParam,
        search_bar: searchBar,
      }));
      await this.queryParamRepository.save(queryParams);
    }

    // Retourner la search bar avec ses relations
    return this.searchBarRepository.findOne({
      where: { id_search_bar: searchBar.id_search_bar },
      relations: ['dorks', 'query_params'],
    });
  }

  public async findByUserAccount(userId: number): Promise<SearchBar[]> {
    return this.searchBarRepository.find({
      where: { user_account: { id: userId } },
      relations: ['user_account', 'query_params', 'dorks'],
    });
  }

  public async update(id: string, updateSearchBarDto: UpdateSearchBarDto, image?: MemoryStorageFile): Promise<UpdateResult> {
    const searchBar = await this.searchBarRepository.findOne({ where: { id_search_bar: id } });
    if (!searchBar) {
      throw new Error('SearchBar not found');
    }

    if (image) {
      // Delete old image if exists
      if (searchBar.image) {
        const oldImagePath = path.join(__dirname, `../../../upload/search-bar`, searchBar.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Save new image
      const ext = image.mimetype.split('/')[1];
      const fileName = `${id}.${ext}`;
      const uploadPath = path.join(__dirname, `../../../upload/search-bar`, fileName);
      fs.writeFileSync(uploadPath, image.buffer);

      (updateSearchBarDto as UpdateSearchBarDto & { image?: string }).image = fileName;
    }

    return this.searchBarRepository.update(id, updateSearchBarDto);
  }

  public async remove(id: string): Promise<DeleteResult> {
    const searchBar = await this.searchBarRepository.findOne({ where: { id_search_bar: id } });
    if (searchBar?.image) {
      const imagePath = path.join(__dirname, `../../../upload/search-bar`, searchBar.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    return this.searchBarRepository.delete(id);
  }
}

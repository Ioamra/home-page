import { MemoryStorageFile } from '@blazity/nest-file-fastify';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserAccount } from '../user-account/entities/user-account.entity';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { Link } from './entities/link.entity';

@Injectable()
export class LinkService {
  constructor(
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
    @InjectRepository(UserAccount)
    private readonly userAccountRepository: Repository<UserAccount>,
  ) {}

  public async create(userId: number, createLinkDto: CreateLinkDto, image?: MemoryStorageFile): Promise<Link> {
    const userAccount = await this.userAccountRepository.findOne({ where: { id: userId } });
    if (!userAccount) {
      throw new Error('User not found');
    }

    const link = await this.linkRepository.save({
      ...createLinkDto,
      user_account: userAccount,
      image: null, // default value
    });

    if (image) {
      const ext = image.mimetype.split('/')[1];
      const fileName = `${link.id_link}.${ext}`;
      await this.linkRepository.update(link.id_link, { image: fileName });

      const uploadPath = path.join(__dirname, `../../../upload/link`, fileName);
      if (!fs.existsSync(path.dirname(uploadPath))) {
        fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
      }
      fs.writeFileSync(uploadPath, image.buffer);
    }

    return link;
  }

  public async findByUserAccount(userId: number): Promise<Link[]> {
    return this.linkRepository.find({
      where: { user_account: { id: userId } },
      relations: ['user_account'],
    });
  }

  public async update(id: string, updateLinkDto: UpdateLinkDto, image?: MemoryStorageFile): Promise<UpdateResult> {
    const link = await this.linkRepository.findOne({ where: { id_link: id } });
    if (!link) {
      throw new Error('Link not found');
    }

    if (image) {
      // Delete old image if exists
      if (link.image) {
        const oldImagePath = path.join(__dirname, `../../../upload/link`, link.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Save new image
      const ext = image.mimetype.split('/')[1];
      const fileName = `${id}.${ext}`;
      const uploadPath = path.join(__dirname, `../../../upload/link`, fileName);
      fs.writeFileSync(uploadPath, image.buffer);

      (updateLinkDto as UpdateLinkDto & { image?: string }).image = fileName;
    }

    return this.linkRepository.update(id, updateLinkDto);
  }

  public async remove(id: string): Promise<DeleteResult> {
    const link = await this.linkRepository.findOne({ where: { id_link: id } });
    if (link?.image) {
      const imagePath = path.join(__dirname, `../../../upload/link`, link.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    return this.linkRepository.delete(id);
  }
}

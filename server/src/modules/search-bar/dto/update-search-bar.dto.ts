import { PartialType } from '@nestjs/mapped-types';
import { CreateSearchBarDto } from './create-search-bar.dto';

export class UpdateSearchBarDto extends PartialType(CreateSearchBarDto) {}

import { PartialType } from '@nestjs/mapped-types';
import { CreatePresetSearchBarDto } from './create-preset-search-bar.dto';

export class UpdatePresetSearchBarDto extends PartialType(CreatePresetSearchBarDto) {}

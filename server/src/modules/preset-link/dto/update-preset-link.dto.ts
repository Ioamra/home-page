import { PartialType } from '@nestjs/mapped-types';
import { CreatePresetLinkDto } from './create-preset-link.dto';

export class UpdatePresetLinkDto extends PartialType(CreatePresetLinkDto) {}

import { PartialType } from '@nestjs/mapped-types';
import { CreatePresetBackgroundDto } from './create-preset-background.dto';

export class UpdatePresetBackgroundDto extends PartialType(CreatePresetBackgroundDto) {}

import { PartialType } from '@nestjs/mapped-types';
import { CreateAppSettingsDto } from './create-app-settings.dto';

export class UpdateAppSettingsDto extends PartialType(CreateAppSettingsDto) {}

import { Type } from './../enum/user.enum';
import { IsAlpha, IsEnum, IsUUID } from 'class-validator';

export class UpdateUserDto {
  @IsUUID()
  id: string;

  @IsAlpha()
  name: string;

  @IsEnum(Type)
  type: Type;
}

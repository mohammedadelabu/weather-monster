import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateWebHookDto {
  @IsNumber()
  @IsNotEmpty()
  city_id: number;
  @IsString()
  @IsNotEmpty()
  callback_url: string;
}

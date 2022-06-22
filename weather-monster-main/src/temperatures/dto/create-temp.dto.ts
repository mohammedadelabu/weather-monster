import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateTempDto {
  @IsNumber()
  @IsNotEmpty()
  city_id: number;
  @IsNumber()
  @IsNotEmpty()
  max: number;
  @IsNumber()
  @IsNotEmpty()
  min: number;
}

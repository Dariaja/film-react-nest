import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDefined,
  IsEmail,
  IsInt,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';

export class TicketDto {
  @IsUUID()
  film: string;

  @IsUUID()
  session: string;

  @IsOptional()
  @IsISO8601()
  daytime?: string;

  @IsInt()
  @Min(1)
  row: number;

  @IsInt()
  @Min(1)
  seat: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;
}

export class CreateOrderDto {
  @IsEmail()
  email: string;

  @IsString()
  @Matches(/\S/)
  phone: string;

  @IsDefined()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TicketDto)
  tickets: TicketDto[];
}

export class OrderTicketDto extends TicketDto {
  id: string;
  daytime: string;
  price: number;
}

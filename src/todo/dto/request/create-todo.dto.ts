import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateTodoRequestDTO {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(128)
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;
}

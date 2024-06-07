import { ApiProperty } from '@nestjs/swagger';

export class TodoResponseDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  done: boolean;
}

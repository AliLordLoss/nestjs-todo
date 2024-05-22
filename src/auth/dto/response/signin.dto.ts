import { ApiProperty } from '@nestjs/swagger';

export class SigninResponseDTO {
  @ApiProperty()
  access: string;
}

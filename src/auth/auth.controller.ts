import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupRequestDTO } from './dto/request/signup.dto';
import { SigninResponseDTO } from './dto/response/signin.dto';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @ApiOperation({
    summary: 'Endpoint for new users to sign up',
  })
  @ApiCreatedResponse({
    description:
      '201 status code means user is created successfully and token is returned in response!',
    type: SigninResponseDTO,
  })
  @ApiBadRequestResponse({
    description:
      '400 status code means email or password are not in correct format!',
  })
  @ApiConflictResponse({
    description: '409 status code means email is already in use!',
  })
  @Post('/signup')
  async signup(@Body() body: SignupRequestDTO): Promise<SigninResponseDTO> {
    return await this.service.signup(body.email, body.password);
  }
}

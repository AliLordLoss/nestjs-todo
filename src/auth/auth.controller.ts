import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
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

  @ApiOperation({
    summary: 'Endpoint for users to sign in',
  })
  @ApiOkResponse({
    description:
      '200 status code means credentials are correct and access token is returned!',
    type: SigninResponseDTO,
  })
  @ApiBadRequestResponse({
    description:
      '400 status code means email or password are not in correct format!',
  })
  @ApiUnauthorizedResponse({
    description: '401 status code means email or password is incorrect!',
  })
  @Post('/signin')
  async signin(@Body() body: SignupRequestDTO): Promise<SigninResponseDTO> {
    return await this.service.signin(body.email, body.password);
  }
}

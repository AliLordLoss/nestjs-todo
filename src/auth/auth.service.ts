import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/db/entities/User';
import { SigninResponseDTO } from './dto/response/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private readonly saltOrRounds: number = 10;

  public async signup(
    email: string,
    password: string,
  ): Promise<SigninResponseDTO> {
    const emailExists = await this.userRepository.exists({ where: { email } });
    if (emailExists) throw new ConflictException('This email is in use!');

    const hashPass = await hash(password, this.saltOrRounds);
    const user = await this.userRepository.save(new User(email, hashPass));
    return await this.getToken(user.id, user.email);
  }

  public async signin(
    email: string,
    password: string,
  ): Promise<SigninResponseDTO> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Email or password incorrect!');
    const passwordMatches = compare(password, user.password);
    if (!passwordMatches)
      throw new UnauthorizedException('Email or password incorrect!');

    return await this.getToken(user.id, user.email);
  }

  private async getToken(userId: number, email: string) {
    const access = await this.jwtService.signAsync(
      {
        sub: userId,
        email,
      },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '2h',
      },
    );

    return {
      access,
    };
  }
}

import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Inject,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserRepository } from '../../modules/user/user.repository';
import { CreateUserDto } from '../common/dto/create-user.dto';
import { User } from '../../modules/user/user.entity';
import { UserRole } from 'src/shared/UserRole';
import { CredentialsDto } from '../common/dto/credentials.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ErrorSendingMailException } from '../exception/ErrorSendingMailException';
import { Logger } from 'winston';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private mailerService: MailerService,
    @Inject('winston')
    private logger: Logger,
  ) {}

  public async signUp(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password != createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem');
    } else {
      try {
        const user = await this.userRepository.createUser(
          createUserDto,
          UserRole.USER,
        );

        const mail = {
          to: user.email,
          from: 'noreply@application.com',
          subject: 'Email de confirmação',
          template: 'confirmation-email',
          context: {
            token: user.confirmationToken,
          },
        };

        await this.mailerService.sendMail(mail);

        return user;
      } catch (error) {
        this.logger.info(error);
        throw new ErrorSendingMailException(
          'Não foi possível enviar o email de confirmação de cadastro',
        );
      }
    }
  }

  public async signIn(credentialsDto: CredentialsDto) {
    const user: User =
      await this.userRepository.checkCredentials(credentialsDto);

    if (user === null) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const jwtPayload: any = { id: user.id };
    const token: string = await this.jwtService.signAsync(jwtPayload);

    return { token };
  }
}

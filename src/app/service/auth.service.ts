/* eslint-disable prettier/prettier */
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { UserRepository } from '../../modules/user/user.repository';
import { CreateUserDto } from '../common/dto/create-user.dto';
import { User } from '../../modules/user/user.entity';
import { UserRole } from 'src/shared/UserRole';
import { CredentialsDto } from '../common/dto/credentials.dto';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UserRepository)
		private userRepository: UserRepository,
		private jwtService: JwtService
	) {}

	public async signUp(createUserDto: CreateUserDto): Promise<User> {
		if (createUserDto.password != createUserDto.passwordConfirmation) {
			throw new UnprocessableEntityException('As senhas não conferem');
		} else {
			return await this.userRepository.createUser(createUserDto, UserRole.USER);
		}
	}

	public async signIn(credentialsDto: CredentialsDto) {
    	const user: User = await this.userRepository.checkCredentials(credentialsDto);

		if (user === null) {
			throw new UnauthorizedException('Credenciais inválidas');
		}

		const jwtPayload: any = { id: user.id, };
		const token: string = await this.jwtService.signAsync(jwtPayload);

		return { token };
  	}
}

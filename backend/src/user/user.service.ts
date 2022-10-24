import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    try {
      await this.userRepository.save(createUserDto);
      delete createUserDto.id;
      return createUserDto;
    } catch (error) {
      throw new InternalServerErrorException(
        'Impossible to save user in database',
      );
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Impossible to find all users');
    }
  }

  async findOne(id: string): Promise<User> {
    const user = this.userRepository
      .createQueryBuilder('user')
      .select(['user.name', 'user.type'])
      .where('user.id = :id', { id: id })
      .getOne();
    if (!user) throw new NotFoundException('Impossible to find user');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    const { name, type } = updateUserDto;
    user.name = name ? name : user.name;
    user.type = type ? type : user.type;
    try {
      await this.userRepository.save(user);
      return this.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException(
        'Impossible to update user in database',
      );
    }
  }

  async remove(id: string): Promise<string> {
    const name = (await this.findOne(id)).name;
    const deleteAction = await this.userRepository.delete({ id });
    if (deleteAction.affected === 0) {
      throw new NotFoundException('Impossible to find a User with informed Id');
    }
    return 'The user ' + name + ' has been removed from the database';
  }
}

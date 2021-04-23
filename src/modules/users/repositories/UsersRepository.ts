import { getRepository, Repository } from 'typeorm';
import User from '@shared/typeorm/entities/User';
import CreateUserDTO from './dtos/CreateUserDTO';
import IUsersRepository from './IUsersRepository';
import UpdateUserDTO from './dtos/UpdateUserDTO';

class UsersRepository implements IUsersRepository {
    private UsersRepository: Repository<User>;

    constructor() {
        this.UsersRepository = getRepository(User);
    }

    public async create(user: CreateUserDTO): Promise<User> {
        const newUser = this.UsersRepository.create(user);

        await this.UsersRepository.save(newUser);

        return newUser;
    }

    public async save(user: UpdateUserDTO): Promise<User> {
        const updatedUser = await this.UsersRepository.save(user);

        return updatedUser;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const findedUser = await this.UsersRepository.findOne({
            where: { email },
        });

        return findedUser;
    }

    public async findById(id: string): Promise<User | undefined> {
        const findedUser = await this.UsersRepository.findOne(id);

        return findedUser;
    }

    public async removeAvatarFromUser(userId: string): Promise<void> {
        await this.UsersRepository.query(
            `UPDATE users SET "avatar" = NULL WHERE id = '${userId}'`,
        );
    }
}

export default UsersRepository;

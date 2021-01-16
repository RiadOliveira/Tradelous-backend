import { getRepository, Repository } from 'typeorm';
import User from '../entities/User';
import UsersRepositoryDTO from './dtos/UsersRepositoryDTO';
import IUsersRepository from './IUsersRepository';

class UsersRepository implements IUsersRepository {
    private UsersRepository: Repository<User>;

    constructor() {
        this.UsersRepository = getRepository(User);
    }

    public async create({
        name,
        email,
        isAdmin,
        password,
    }: UsersRepositoryDTO): Promise<User> {
        const newUser = this.UsersRepository.create({
            name,
            password,
            email,
            isAdmin,
        });

        await this.UsersRepository.save(newUser);

        return newUser;
    }

    public async update(user: User): Promise<User> {
        const updatedUser = await this.UsersRepository.save(user);

        return updatedUser;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const findedUser = await this.UsersRepository.findOne({
            where: { email },
        });

        return findedUser;
    }
}

export default UsersRepository;

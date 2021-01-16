import User from '../entities/User';
import UsersRepositoryDTO from './dtos/UsersRepositoryDTO';

export default interface IUsersRepository {
    create(data: UsersRepositoryDTO): Promise<User>;
    update(user: User): Promise<User>;
    findByEmail(email: string): Promise<User | undefined>;
}

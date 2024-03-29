import User from '@shared/typeorm/entities/User';
import CreateUserDTO from './dtos/CreateUserDTO';
import UpdateUserDTO from './dtos/UpdateUserDTO';

export default interface IUsersRepository {
    create(data: CreateUserDTO): Promise<User>;
    save(user: UpdateUserDTO): Promise<User>;
    findByEmail(email: string): Promise<User | undefined>;
    findById(id: string): Promise<User | undefined>;
    deleteAvatar(userId: string): Promise<void>;
    leaveCompany(userId: string): Promise<void>;
    delete(userId: string): Promise<void>;
}

import User from '../database/entities/User';
import UsersRepository from '../database/repositories/UsersRepository';
import AppError from '../errors/AppError';
import BCryptHashProvider from '../providers/HashProvider/implementations/BCryptProvider';

interface UserData {
    password: string;
    email: string;
}

export default class CreateSessionService {
    public async execute({ password, email }: UserData): Promise<User> {
        const usersRepository = new UsersRepository();
        const hashProvider = new BCryptHashProvider();

        const findedUser = await usersRepository.findByEmail(email);

        if (!findedUser) {
            throw new AppError('Incorrect e-mail or password');
        }

        const verifyHash = await hashProvider.compareHash(
            password,
            findedUser.password,
        );

        if (!verifyHash) {
            throw new AppError('Incorrect e-mail or password');
        }

        return findedUser;
    }
}

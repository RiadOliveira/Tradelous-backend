import User from '../database/entities/User';
import UsersRepository from '../database/repositories/UsersRepository';
import AppError from '../errors/AppError';
import BCryptHashProvider from '../providers/HashProvider/implementations/BCryptProvider';

interface UserData {
    name: string;
    password: string;
    email: string;
    isAdmin: boolean;
}

export default class CreateUserService {
    public async execute({
        name,
        password,
        email,
        isAdmin,
    }: UserData): Promise<User> {
        const usersRepository = new UsersRepository();
        const hashProvider = new BCryptHashProvider();

        const findedUser = await usersRepository.findByEmail(email);

        if (findedUser) {
            throw new AppError("User's email already exists");
        }

        console.log('TESTE');

        const hashedPassword = await hashProvider.hash(password);

        const newUser = await usersRepository.create({
            name,
            password: hashedPassword,
            isAdmin,
            email,
        });

        return newUser;
    }
}

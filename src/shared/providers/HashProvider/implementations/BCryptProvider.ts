import { compare, hash } from 'bcrypt';
import IHashProvider from '../IHashProvider';

export default class BCryptProvider implements IHashProvider {
    public async hash(password: string): Promise<string> {
        const hashedPassword = await hash(password, 8);

        return hashedPassword;
    }

    public async compareHash(
        password: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return compare(password, hashedPassword);
    }
}

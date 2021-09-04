import { compare, hash as bcryptHash } from 'bcrypt';
import IHashProvider from '../IHashProvider';

export default class BCryptProvider implements IHashProvider {
    public async hash(value: string): Promise<string> {
        return bcryptHash(value, 8);
    }

    public async compareHash(
        value: string,
        hashedValue: string,
    ): Promise<boolean> {
        return compare(value, hashedValue);
    }
}

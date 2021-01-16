export default interface IHashProvider {
    hash(password: string): Promise<string>;

    compareHash(password: string, hashedPassword: string): Promise<boolean>;
}

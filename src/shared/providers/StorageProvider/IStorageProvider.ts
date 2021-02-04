export default interface IStorageProvider {
    save(filename: string): Promise<void>;
    delete(filename: string): Promise<void>;
    clearTemp(filename: string): Promise<void>;
}

export default interface IStorageProvider {
    save(filename: string): Promise<void>;
    delete(filename: string): Promise<void>;
    deleteFileFromTemp(filename: string): Promise<void>;
}

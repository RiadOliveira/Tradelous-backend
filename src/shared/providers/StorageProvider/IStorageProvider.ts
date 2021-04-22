export default interface IStorageProvider {
    save(
        filename: string,
        type: 'avatar' | 'logo' | 'productImage',
    ): Promise<void>;
    delete(
        filename: string,
        type: 'avatar' | 'logo' | 'productImage',
    ): Promise<void>;
    deleteFileFromTemp(filename: string): Promise<void>;
}

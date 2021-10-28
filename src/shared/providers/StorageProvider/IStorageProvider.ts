export default interface IStorageProvider {
    save(
        filename: string,
        type: 'avatar' | 'logo' | 'product-image',
    ): Promise<void>;
    delete(
        filename: string,
        type: 'avatar' | 'logo' | 'product-image',
    ): Promise<void>;
    deleteFileFromTemp(filename: string): Promise<void>;
}

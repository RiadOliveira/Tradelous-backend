import IStorageProvider from '../IStorageProvider';
import fs from 'fs';
import path from 'path';

export default class DiskProvider implements IStorageProvider {
    public async save(
        filename: string,
        type: 'avatar' | 'logo' | 'product-image',
    ): Promise<void> {
        await fs.promises.copyFile(
            `tmp/${filename}`,
            path.resolve('tmp', 'uploads', `${type}`, filename),
        );

        await fs.promises.unlink(`tmp/${filename}`);
    }

    public async delete(
        filename: string,
        type: 'avatar' | 'logo' | 'product-image',
    ): Promise<void> {
        await fs.promises.unlink(`tmp/uploads/${type}/${filename}`);
    }

    public async deleteFileFromTemp(filename: string): Promise<void> {
        await fs.promises.unlink(`tmp/${filename}`);
    }
}

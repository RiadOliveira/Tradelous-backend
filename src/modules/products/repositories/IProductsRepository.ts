import Product from '@shared/typeorm/entities/Product';
import CreateProductDTO from './dtos/CreateProductDTO';

export default interface IProductsRepository {
    create(product: CreateProductDTO): Promise<Product>;
    save(product: Product): Promise<Product>;
    delete(productId: string): Promise<void>;
    findById(productId: string): Promise<Product | undefined>;
    deleteImage(productId: string): Promise<void>;
}

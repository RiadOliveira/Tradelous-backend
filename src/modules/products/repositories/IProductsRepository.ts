import Product from '@shared/typeorm/entities/Product';
import CreateProductDTO from './dtos/CreateProductDTO';

export default interface IProductsRepository {
    create(product: CreateProductDTO): Promise<Product>;
    save(product: Product): Promise<Product>;
    listCompanysProducts(companyId: string): Promise<Product[] | undefined>;
    removeProduct(productId: string): Promise<void>;
    findById(productId: string): Promise<Product | undefined>;
    removeImageFromProduct(productId: string): Promise<void>;
}

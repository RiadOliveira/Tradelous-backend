import Product from '@shared/typeorm/entities/Product';

export default interface IProductsRepository {
    create(product: Product, companyId: string): Promise<Product>;
    save(product: Product): Promise<Product>;
    listCompanysProducts(companyId: string): Promise<Product[] | undefined>;
    removeProduct(productId: string): Promise<void>;
    findById(productId: string): Promise<Product | undefined>;
}

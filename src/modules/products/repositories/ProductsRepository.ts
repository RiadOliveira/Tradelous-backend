import { getRepository, Repository } from 'typeorm';
import Product from '@shared/typeorm/entities/Product';
import IProductsRepository from './IProductsRepository';
import CreateProductDTO from './dtos/CreateProductDTO';

class ProductsRepository implements IProductsRepository {
    private ProductsRepository: Repository<Product>;

    constructor() {
        this.ProductsRepository = getRepository(Product);
    }

    public async create(product: CreateProductDTO): Promise<Product> {
        const newProduct = this.ProductsRepository.create(product);

        return this.ProductsRepository.save(newProduct);
    }

    public async save(product: Product): Promise<Product> {
        return this.ProductsRepository.save(product);
    }

    public async removeProduct(productId: string): Promise<void> {
        await this.ProductsRepository.delete(productId);
    }

    public async findById(productId: string): Promise<Product | undefined> {
        const findedProduct = await this.ProductsRepository.findOne(productId);

        return findedProduct;
    }

    public async removeImageFromProduct(productId: string): Promise<void> {
        await this.ProductsRepository.query(
            `UPDATE products SET "image" = NULL WHERE id = '${productId}'`,
        );
    }
}

export default ProductsRepository;

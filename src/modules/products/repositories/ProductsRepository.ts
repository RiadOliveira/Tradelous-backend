import { getRepository, Repository } from 'typeorm';
import Product from '@shared/typeorm/entities/Product';
import IProductsRepository from './IProductsRepository';

class ProductsRepository implements IProductsRepository {
    private ProductsRepository: Repository<Product>;

    constructor() {
        this.ProductsRepository = getRepository(Product);
    }

    public async create(product: Product, companyId: string): Promise<Product> {
        const newProduct = this.ProductsRepository.create({
            ...product,
            companyId,
        });

        return this.ProductsRepository.save(newProduct);
    }

    public async save(product: Product): Promise<Product> {
        return this.ProductsRepository.save(product);
    }

    public async listCompanysProducts(
        companyId: string,
    ): Promise<Product[] | undefined> {
        const companysProducts = await this.ProductsRepository.find({
            where: { companyId },
        });

        return companysProducts;
    }

    public async removeProduct(productId: string): Promise<void> {
        await this.ProductsRepository.delete(productId);
    }

    public async findById(productId: string): Promise<Product | undefined> {
        const findedProduct = await this.ProductsRepository.findOne(productId);

        return findedProduct;
    }
}

export default ProductsRepository;

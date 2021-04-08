export default interface CreateProductDTO {
    name: string;
    companyId: string;
    price: number;
    brand: string;
    qrCode?: string;
}

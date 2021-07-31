export default interface CreateSaleDTO {
    companyId: string;
    employeeId: string;
    productId: string;
    method: 'money' | 'card';
    quantity: number;
    totalPrice: number;
}

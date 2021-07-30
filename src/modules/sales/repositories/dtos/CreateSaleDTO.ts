export default interface CreateSaleDTO {
    companyId: string;
    employeeId: string;
    productId: string;
    type: 'money' | 'card';
    quantity: number;
    totalPrice: number;
}

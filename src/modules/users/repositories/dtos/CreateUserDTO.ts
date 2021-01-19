export default interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
    companyId?: string;
    isAdmin: boolean;
}

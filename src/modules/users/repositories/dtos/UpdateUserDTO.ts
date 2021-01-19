export default interface UpdateUserDTO {
    name: string;
    id: string;
    email: string;
    password?: string;
    isAdmin: boolean;
    companyId?: string;
    avatar?: string;
}

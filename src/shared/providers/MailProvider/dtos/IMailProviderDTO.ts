interface IMailContact {
    name: string;
    email: string;
}

export default interface IMailProviderDTO {
    to: IMailContact;
    from?: IMailContact;
    subject: string;
    text: string;
}

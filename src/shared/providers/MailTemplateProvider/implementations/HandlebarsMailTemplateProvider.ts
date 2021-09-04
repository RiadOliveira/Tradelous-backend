import IMailTemplateProvider from '../IMailTemplateProvider';
import handlebars from 'handlebars';
import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

import fs from 'fs';

export default class HandlebarsMailTemplateProvider
    implements IMailTemplateProvider {
    public async parseTemplate({
        file,
        variables,
    }: IParseMailTemplateDTO): Promise<string> {
        const templateFileContent = await fs.promises.readFile(file, {
            encoding: 'utf-8',
        });

        const parseTemplate = handlebars.compile(templateFileContent);

        return parseTemplate(variables);
    }
}

import IMailTemplateProvider from '../IMailTemplateProvider';
import nunjucks from 'nunjucks';
import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

import fs from 'fs';

export default class NunJucksMailTemplateProvider
    implements IMailTemplateProvider {
    public async parseTemplate({
        file,
        variables,
    }: IParseMailTemplateDTO): Promise<string> {
        const templateFileContent = await fs.promises.readFile(file, {
            encoding: 'utf-8',
        });

        const parseTemplate = nunjucks.compile(templateFileContent);

        return parseTemplate.render(variables);
    }
}

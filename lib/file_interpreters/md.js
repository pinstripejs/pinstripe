
import { promisify } from 'util';
import { readFile } from 'fs';
import MarkdownIt from 'markdown-it';
import JsYaml from 'js-yaml';

export default async filePath => {
    let frontMatter = {};
    let body = (await promisify(readFile)(filePath)).toString();
    const matches = body.match(/^---+([\S\s]*?)---+([\S\s]*)$/);
    if(matches){
        frontMatter = JsYaml.load(matches[1]);
        body = matches[2];
    }
    body = MarkdownIt('commonmark').render(body);

    return ({ renderView, renderHtml }) => renderView('layout', {
        ...frontMatter,
        body: renderHtml(body)
    });
};

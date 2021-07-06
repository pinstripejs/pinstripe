
import { defineCommand } from 'pinstripe';

defineCommand('generate-view', async ({
    cliUtils: { extractArg },
    fsBuilder: { inProjectRootDir, generateFile, line, indent }
}) => {
    let name = extractArg('').replace(/^\//, '');
    if(name == ''){
        console.error('A view name must be given.');
        process.exit();
    }

    if(!name.match(/\.[^\/]+$/)){
        name = `${name}.js`
    }

    await inProjectRootDir(async () => {
        await generateFile(`lib/views/${name}`, () => {
            line();
            line(`import { defineView } from 'pinstripe';`);
            line();
            line(`defineView('${name}', ({ renderHtml }) => renderHtml\``);
            indent(() => {
                line(`<h1>${name} view<h1>`);
            })
            line('`);');
            line();
        });

    });
});

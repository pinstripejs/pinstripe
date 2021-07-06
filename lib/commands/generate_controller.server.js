
import { defineCommand } from 'pinstripe';

defineCommand('generate-controller', async ({
    cliUtils: { extractArg },
    fsBuilder: { inProjectRootDir, generateFile, line, indent }
}) => {
    let name = extractArg('').replace(/^\//, '');
    if(name == ''){
        console.error('A controller name must be given.');
        process.exit();
    }

    if(!name.match(/\.[^\/]+$/)){
        name = `${name}.js`
    }

    await inProjectRootDir(async () => {
        await generateFile(`lib/controllers/${name}`, () => {
            line();
            line(`import { defineController } from 'pinstripe';`);
            line();
            line(`defineController('${name}', ({ renderHtml }) => renderHtml\``);
            indent(() => {
                line(`<h1>${name} controller<h1>`);
            })
            line('`);');
            line();
        });

    });
});

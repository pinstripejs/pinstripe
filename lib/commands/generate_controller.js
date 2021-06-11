
export default async ({
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

        await generateFile(`lib/controllers/_importer.js`, { skipIfExists: true }, () => {
            line();
            line(`export default 'controller';`);
            line();
        });

        await generateFile(`lib/controllers/${name}`, () => {
            line();
            line(`export default async ({ renderHtml }) => renderHtml\``);
            indent(() => {
                line(`<h1>${name} controller<h1>`);
            })
            line('`');
            line();
        });

    });
};

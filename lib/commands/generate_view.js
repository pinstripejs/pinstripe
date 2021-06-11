
export default async ({
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

        await generateFile(`lib/views/_importer.js`, { skipIfExists: true }, () => {
            line();
            line(`export default 'view';`);
            line();
        });

        await generateFile(`lib/views/${name}`, () => {
            line();
            line(`export default async ({ renderHtml }) => renderHtml\``);
            indent(() => {
                line(`<h1>${name} view<h1>`);
            })
            line('`');
            line();
        });

    });
};

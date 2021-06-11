
export default async ({
    cliUtils: { extractArg },
    fsBuilder: { inProjectRootDir, generateFile, line, indent },
    snakeify
}) => {
    const name = snakeify(extractArg(''));
    if(name == ''){
        console.error('A command name must be given.');
        process.exit();
    }

    await inProjectRootDir(async () => {

        await generateFile(`lib/commands/_importer.js`, { skipIfExists: true }, () => {
            line();
            line(`export default 'command';`);
            line();
        });

        await generateFile(`lib/commands/${name}.js`, () => {
            line();
            line(`export default async ({ args }) => {`);
            indent(() => {
                line();
            })
            line('};');
            line();
        });

    });
};

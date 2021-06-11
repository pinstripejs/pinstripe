
export default async ({
    cliUtils: { extractArg },
    fsBuilder: { inProjectRootDir, generateFile, line, indent },
    snakeify
}) => {
    const name = snakeify(extractArg(''));
    if(name == ''){
        console.error('A service name must be given.');
        process.exit();
    }

    await inProjectRootDir(async () => {

        await generateFile(`lib/service_factories/_importer.js`, { skipIfExists: true }, () => {
            line();
            line(`export default 'service_factory';`);
            line();
        });

        await generateFile(`lib/service_factories/${name}.js`, () => {
            line();
            line(`export default () => {`);
            indent(() => {
                line(`return () => 'Example service';`);
            })
            line('};');
            line();
        });

    });
};

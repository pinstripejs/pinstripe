
import { defineCommand } from 'pinstripe';

defineCommand('generate-service', async ({
    cliUtils: { extractArg },
    fsBuilder: { inProjectRootDir, generateFile, line, indent },
    snakeify, camelize
}) => {
    const name = snakeify(extractArg(''));
    if(name == ''){
        console.error('A service name must be given.');
        process.exit();
    }

    await inProjectRootDir(async () => {
        await generateFile(`lib/services/${name}.js`, () => {
            line();
            line(`import { defineService } from 'pinstripe';`);
            line();
            line(`defineService('${camelize(name)}', () => {`);
            indent(() => {
                line(`return () => 'Example service';`);
            })
            line('});');
            line();
        });

    });
});

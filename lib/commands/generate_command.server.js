
import { defineCommand } from 'pinstripe';

defineCommand('generate-command', async ({
    cliUtils: { extractArg },
    fsBuilder: { inProjectRootDir, generateFile, line, indent },
    snakeify, camelize
}) => {
    const name = snakeify(extractArg(''));
    if(name == ''){
        console.error('A command name must be given.');
        process.exit();
    }

    await inProjectRootDir(async () => {

        await generateFile(`lib/commands/${name}.js`, () => {
            line();
            line(`import { defineCommand } from 'pinstripe';`);
            line();
            line(`defineCommand('${camelize(name)}', async ({ args }) => {`);
            indent(() => {
                line();
            })
            line('});');
            line();
        });

    });
});
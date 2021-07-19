
export default Class => Class.props({
    async run(){
        const {
            cliUtils: { extractArg },
            fsBuilder: { inProjectRootDir, generateFile, line, indent },
            snakeify
        } = this;
         
        const name = snakeify(extractArg(''));
        if(name == ''){
            console.error('A command name must be given.');
            process.exit();
        }

        await inProjectRootDir(async () => {

            await generateFile(`lib/commands/_importer.js`, { skipIfExists: true }, () => {
                line();
                line(`import { Command } from 'pinstripe';`);
                line();
                line(`export default Command.importer;`);
                line();
            });

            await generateFile(`lib/commands/${name}.server.js`, () => {
                line();
                line(`export default ['run', async ({ args }) => {`);
                indent(() => {
                    line();
                })
                line('}];');
                line();
            });

        });
    }
});

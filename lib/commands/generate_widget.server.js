
export default Class => Class.props({
    async run(){
        const {
            cliUtils: { extractArg },
            fsBuilder: { inProjectRootDir, generateFile, line, indent },
            snakeify
        } = this;

        const name = snakeify(extractArg(''));
        if(name == ''){
            console.error('A widget name must be given.');
            process.exit();
        }

        await inProjectRootDir(async () => {

            await generateFile(`lib/widgets/_importer.js`, { skipIfExists: true }, () => {
                line();
                line(`import { Widget } from 'pinstripe';`);
                line();
                line(`export default Widget.importer;`);
                line();
            });

            await generateFile(`lib/widgets/${name}.js`, () => {
                line();
                line(`export default {`);
                indent(() => {
                    line();
                })
                line('};');
                line();
            });

        });
    }
});

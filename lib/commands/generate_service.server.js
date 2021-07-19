
export default Class => Class.props({
    async run(){
        const {
            cliUtils: { extractArg },
            fsBuilder: { inProjectRootDir, generateFile, line },
            snakeify
        } = this;

        const name = snakeify(extractArg(''));
        if(name == ''){
            console.error('A service name must be given.');
            process.exit();
        }

        await inProjectRootDir(async () => {
            
            await generateFile(`lib/service_factories/_importer.js`, { skipIfExists: true }, () => {
                line();
                line(`import { ServiceFactory } from 'pinstripe';`);
                line();
                line(`export default ServiceFactory.importer;`);
                line();
            });

            await generateFile(`lib/service_factories/${name}.js`, () => {
                line();
                line(`export default ['create', () => 'Example ${name} service'];`);
                line();
            });

        });
    }
});

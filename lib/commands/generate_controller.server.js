
export default Class => Class.props({
    async run(){
        const {
            cliUtils: { extractArg },
            fsBuilder: { inProjectRootDir, generateFile, line, indent }
        } = this;
        
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
                line(`import { Controller } from 'pinstripe';`);
                line();
                line(`export default Controller.importer;`);
                line();
            });

            await generateFile(`lib/controllers/${name}`, () => {
                line();
                line(`export default ['render', ({ renderHtml }) => renderHtml\``);
                indent(() => {
                    line(`<h1>${name} controller<h1>`);
                })
                line('`];');
                line();
            });

        });
    }
});

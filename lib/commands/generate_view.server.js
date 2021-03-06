
export default Class => Class.props({
    async run(){
        const {
            cliUtils: { extractArg },
            fsBuilder: { inProjectRootDir, generateFile, line, indent }
        } = this;

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
                line(`import { View } from 'pinstripe';`);
                line();
                line(`export default View.importer;`);
                line();
            });

            await generateFile(`lib/views/${name}`, () => {
                line();
                line(`export default ['render', ({ renderHtml }) => renderHtml\``);
                indent(() => {
                    line(`<h1>${name} view<h1>`);
                })
                line('`];');
                line();
            });

        });
    }
});

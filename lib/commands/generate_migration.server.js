
export default Class => Class.props({
    async run(){
        const {
            cliUtils: { extractArg, extractFields, extractOptions },
            fsBuilder: { inProjectRootDir, generateFile, line, indent },
            snakeify, args
        } = this;

        const suffix = snakeify(extractArg('migration'));
        const fields = extractFields();
        const { table } = extractOptions({
            table: (() => {
                const matches = suffix.match(/_to_(.+)$/);
                if(matches){
                    return matches[1];
                }
            })()
        });

        const unixTime = Math.floor(new Date().getTime() / 1000);
        const name = `${unixTime}_${suffix}`;

        await inProjectRootDir(async () => {

            await generateFile(`lib/migrations/_importer.js`, { skipIfExists: true }, () => {
                line();
                line(`import { Migration } from 'pinstripe';`);
                line();
                line(`export default Migration.importer;`);
                line();
            });

            await generateFile(`lib/migrations/${name}.js`, () => {
                line();
                if(table){
                    line(`export default ['migrate', async ({ database: { ${table} } }) => {`);
                } else {
                    line(`export default ['migrate', async ({ database }) => {`);
                }
                indent(() => {
                    line();
                    if(table && fields.length){
                        fields.forEach(({ name, type }) => {
                            line(`await ${table}.addColumn('${name}', '${type}');`);
                        });
                        line();
                    }
                })
                line('}];');
                line();
            });

        });
    }
});

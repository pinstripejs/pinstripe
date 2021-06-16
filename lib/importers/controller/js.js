
export default async ({ filePath, relativeFilePath, defineController, delegateTo }) => {
    if(relativeFilePath.match(/static\//)){
        await delegateTo('controller/default');
    } else {
        const name = relativeFilePath.replace(/^\//, '').replace(/\.js$/, '');
        const { default: fn } = await import(filePath);
        if(typeof fn == 'function'){
            defineController(name, fn);
        }
    }
};

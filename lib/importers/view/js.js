
export default async ({ filePath, relativeFilePath, defineView, delegateTo }) => {
    if(relativeFilePath.match(/static\//)){
        await delegateTo('view/default');
    } else {
        const name = relativeFilePath.replace(/^\//, '').replace(/\.js$/, '');
        const { default: fn } = await import(filePath);
        if(typeof fn == 'function'){
            defineView(name, fn);
        }
    }
};

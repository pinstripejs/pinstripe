
export const js = async ({ filePath, relativeFilePath, defineController, }) => {
    const name = relativeFilePath.replace(/^\//, '').replace(/\.js$/, '');
    const { default: fn } = await import(filePath);
    if(typeof fn == 'function'){
        defineController(name, fn);
    }
}

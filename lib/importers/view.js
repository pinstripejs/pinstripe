
export const js = async ({ filePath, relativeFilePath, defineView }) => {
    const name = relativeFilePath.replace(/^\//, '').replace(/\.js$/, '');
    const { default: fn } = await import(filePath);
    if(typeof fn == 'function'){
        defineView(name, fn);
    }
}


export const js = async ({ filePath, name, defineServiceFactory, camelize }) => {
    const { default: fn } = await import(filePath);
    if(typeof fn == 'function'){
        defineServiceFactory(camelize(name), fn);
    }
}
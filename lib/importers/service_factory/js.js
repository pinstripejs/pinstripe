
export default async ({ filePath, name, defineServiceFactory, camelize }) => {
    const { default: fn, ...options } = await import(filePath);
    if(typeof fn == 'function'){
        defineServiceFactory(camelize(name), options, fn);
    }
};

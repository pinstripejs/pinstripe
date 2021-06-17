
export default async ({ extension, filePath, name, defineServiceFactory, camelize }) => {
    if(extension != 'js'){
        return;
    }
    const { default: fn, ...options } = await import(filePath);
    if(typeof fn == 'function'){
        defineServiceFactory(camelize(name), options, fn);
    }
};

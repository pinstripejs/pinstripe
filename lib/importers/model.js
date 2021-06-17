
export default async ({ extension, filePath, name, defineModel }) => {
    if(extension != 'js'){
        return;
    }
    const { default: fn, abstract } = await import(filePath);
    if(typeof fn == 'function' && !abstract){
        defineModel(name, fn);
    }
}

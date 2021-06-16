
export default async ({ filePath, name, defineModel }) => {
    const { default: fn, abstract } = await import(filePath);
    if(typeof fn == 'function' && !abstract){
        defineModel(name, fn);
    }
}

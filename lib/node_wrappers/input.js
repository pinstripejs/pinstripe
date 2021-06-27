
export const selector = 'input, textarea, .p-input';

export default (dsl => dsl
    .props({
        get name(){
            return this.attributes.name;
        },
        
        get value(){
            if(this.is('input[type="checkbox"], input[type="radio"]')){
                return this.is(':checked') ? this.node.value : undefined;
            }
            return this.node.value;
        }
    })
);

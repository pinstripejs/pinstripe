
export default Class => Class.props({
    async run(){
        await this.database.create();
    }
});


export default Class => Class.props({
    async run(){
        await this.database.drop();
        await this.database.create();
        await this.database.migrate();
    }
});

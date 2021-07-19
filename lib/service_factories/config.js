
export default Class => Class.props({
    create(){
        return {
            database: {
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'pinstripe_development'
            }
        }
    }
});

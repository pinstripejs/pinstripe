
export default async ({ database }) => {
    await database.drop();
    await database.create();
    await database.migrate();
};

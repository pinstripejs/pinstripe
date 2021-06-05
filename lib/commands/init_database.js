
export default async ({ database }) => {
    await database.create();
    await database.migrate();
};

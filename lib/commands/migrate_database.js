
export default async ({ database }) => {
    await database.migrate();
};

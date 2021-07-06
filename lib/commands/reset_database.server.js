
import { defineCommand } from 'pinstripe';

defineCommand('reset-database', async ({ database }) => {
    await database.drop();
    await database.create();
    await database.migrate();
});

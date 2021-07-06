
import { defineCommand } from 'pinstripe';

defineCommand('init-database', async ({ database }) => {
    await database.create();
    await database.migrate();
});

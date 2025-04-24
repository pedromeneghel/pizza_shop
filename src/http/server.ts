import { Elysia } from 'elysia';
import { authenticateFromLink } from './routes/authenticate-from-link';
import { getManagedRestaurant } from './routes/get-managed-restaurant';
import { getProfile } from './routes/get-profile';
import { registerRestaurant } from './routes/register-restaurant';
import { sendAuthLink } from './routes/send-auth-link';
import { signOut } from './routes/sign-out';

const app = new Elysia()
    .use(registerRestaurant)
    .use(sendAuthLink)
    .use(authenticateFromLink)
    .use(signOut)
    .use(getProfile)
    .use(getManagedRestaurant)
    .onError(({ error, code, set }) => {
        switch (code) {
            case 'VALIDATION': {
                set.status = 400;
                return { code, message: 'Validation failed', error };
            }
            default: {
                set.status = 500;
                return { code, message: 'Internal Server Error' };
            }
        }
    })

app.listen(3333, () => { console.log('Server is running on port 3333') });

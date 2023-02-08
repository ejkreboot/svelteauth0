import checkToken from "$lib/server/checkToken";
import { redirect } from '@sveltejs/kit';

export const handle = async ({ event, resolve }) => {
  const path = event.url.pathname;
  if(path.match("/protected")) {  
    const session = event.cookies.get('session');
    const user = await checkToken(session);
    if(user) {
      event.locals.user = user;
      return await resolve(event);
    } else {
      throw redirect(307, '/');
    }
  } else {
    return await resolve(event);
  }
}

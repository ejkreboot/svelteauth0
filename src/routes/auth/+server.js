import cookie from 'cookie';
import checkToken from '$lib/server/checkToken';


export async function POST({ request, params, url }) {
  const token = await request.json();
  const valid = await checkToken(token);

  const options = {
    status:200,
    headers: {
      "Content-type" : "application/json",
      "Content-Language": "en"
    }
  }
  if(valid) {
    const exp = new Date(valid.exp * 1000);
    options.headers["set-cookie"] = cookie.serialize("session", token, {httpOnly: true, 
                                                                       secure: true, 
                                                                       sameSite: 'strict', 
                                                                       expires: exp});
  } else {
    const exp = new Date(Number(new Date()) - 1000);
    options.headers["set-cookie"] = cookie.serialize("session", "logged out.", { httpOnly: true, 
                                                                      secure: true, 
                                                                      sameSite: 'strict', 
                                                                      expires: exp});
  } 
  return(new Response(JSON.stringify({result: 'OK'}), options));
}

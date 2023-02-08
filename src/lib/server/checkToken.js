import config from "../../auth_config";
import jwt from "jsonwebtoken";

async function checkToken(token) {
  let valid, user_info;
  const key_response = await fetch("https://" + config.domain + "/pem")
  const public_key = await key_response.text();  
  try {
    valid = jwt.verify(token, public_key)
    user_info = {
      email: valid.email,
      nickname: valid.nickname,
      picture: valid.picture,
      email_verified: valid.email_verified,
      name: valid.name,
      sub: valid.sub,
      updated_at: valid.updated_at,
      exp: valid.exp
    }
  } catch(e) {
    user_info = null;
  }
  return(user_info);
}

export default checkToken;
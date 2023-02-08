import { createAuth0Client } from "@auth0/auth0-spa-js";
import { user, isAuthenticated } from "$lib/store";
import config from "../auth_config";

async function createClient() {
  let auth0Client = await createAuth0Client({
    domain: config.domain,
    clientId: config.clientId,
    cacheLocation: 'localstorage'
  });
  return auth0Client;
}

async function loginWithPopup(client) {
  try {
    await client.loginWithPopup();
    user.set(await client.getUser());
    console.log("USER: ", await client.getUser());
    isAuthenticated.set(true);

    const key = "@@auth0spajs@@::" + config.clientId + "::@@user@@"
    const token = JSON.parse(window.localStorage[key]).id_token;

    const response = await fetch("/auth", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(token) 
    });
  } catch (e) {
    console.log(e);
  }
}

async function logout(client) {
  // invalidate cookie
  const response = await fetch("/auth", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: "{}"
  });
  user.set({});
  isAuthenticated.set(false);
  return client.logout();
}

const auth = {
  createClient,
  loginWithPopup,
  logout
};

export default auth;
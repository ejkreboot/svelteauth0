# SvelteKit Auth0 example

This is a simple app demonstrating how to leverage Auth0 for authentication both client side and server side. 

## No warranty expressed or implied

This code is provided for educational purposes only. The lesson embedded in this code may very well be "this is how not 
to do things." I make no assertions about the security of this code. I have made reasonable effort to follow best practices, 
but I am not a security expert, and make no claims that there are no backdoors or loopholes in this code creating 
vulnerabilities. Use at your own risk.

Likely this code is just fine as a starting point for protecting low value assets like an online course or such. Using 
this code to protect high value assets (financial data, personal info, etc.) without expert scrutiny and assistance would 
be just crazy.

## Usage

If you have not done so already, you will need to sign up for a free account at auth0.com. For this example I used 
the following settings when creating the application within auth0.

* Select "Regular Web Application"
* Click Settings (bypass the 'quick starts')
* **IMPORTANT:** Under "Application Properties", make sure "Token Endpoint Authentication Method" is set to 'None'.
* Allowed Callback URLs: http://localhost:5173
* Allowed Login URL: Leave blank
* Allowed Logout URLs: http://localhost:5173
* Allowed Web origins: http://localhost:5173
* CORS: Can leave disabled.
* Refresh Token: Can leave disabled.

Then...

```
git clone https://github.com/ejkreboot/svelteauth0
cd svelteauth0
npm install
mv src/auth_config.js.ex src/auth_config.js

```

You will then need to update `src/auth_config.js` with your auth0 details (your domain and client ID).

Then:

```
npm run dev
```

And point your browser to [http://localhost:5173/](http://localhost:5173/). 

You should be able to click "Login" and then sign up and login via the Auth0 interface.

## Key Features

The main layout (`src/routes/+layout.svelte`) uses the auth0 client side SDK to manage logging in and 
keep track of authorization state, updating store variables as needed.

Pages can then use the svelte stores to conditionally render material based on who (if anyone) is 
authenticated. For a simple example, see `src/routes/+page.svelte`.

When a user is authenticated using the client side SDK, the resulting identity token is then also `POST`ed 
back to the server (see `authService.js` and the endpoint defined by `src\routes\auth\+server.js` for details.) 
The response returned by the endpoint sets a session cookie containing the 
identity token. (In addition, you could take that opportunity to store the user details in a database on the 
server--or a different server--to provide more granular control over permissions, etc.)

That session cookie can be used by `hooks.server.js` to control access to routes. In this example, only 
authenticated users can access routes under `/protected`. Each time such a page is requested, the session 
cookie is retrieved and its authenticity is verified using our domain's auth0 public key (and the JWT 
verification will also confirm it is not expired.) If the cookie does not contain a valid token, the user 
is redirected to the main page.

When the user logs out, the cookie is removed.
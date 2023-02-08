<script>
    import { onMount } from "svelte";
    import auth from "$lib/authService";
    import { isAuthenticated, user } from "$lib/store";
  
    let auth0Client;
  
    onMount(async () => {
      auth0Client = await auth.createClient();
      isAuthenticated.set(await auth0Client.isAuthenticated());
      user.set(await auth0Client.getUser());
    });
  
    function login() {
      auth.loginWithPopup(auth0Client);
    }
  
    function logout() {
      auth.logout(auth0Client);
    }
</script>
  
<body>
<main class="container">
<nav>
    <ul>
        <li><strong>Svelte Auth0</strong></li>
    </ul>
    <ul>
        {#if $isAuthenticated}
        <li><a class="nav-link" href="/protected">Protected Stuff</a></li>
        <li><a class="nav-link" href="/" on:click="{logout}">Log Out</a></li>
        <li><small>{ $user.email }</small></li>
        <li><img alt="avatar" src={ $user.picture} height="40" width="40"/></li>
        {:else}
        <li><a class="nav-link" href="/" on:click="{login}">Log In</a></li>
        {/if}
    </ul>
</nav>
    <slot />
</main>
</body>

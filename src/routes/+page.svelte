<script>
  import { isAuthenticated, user } from "$lib/store";
</script>

<article>This is the main page. It is public.</article>

{#if $isAuthenticated}
<article>Oh, but I see you are logged in as { $user.email }, so I will also display this information. </article>
{:else}
<article>And since you are not logged in, this information is also displayed.</article>
{/if}
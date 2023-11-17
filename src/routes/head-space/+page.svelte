<script lang="ts">
  import PartySocket from "partysocket";

  // declare const PARTYKIT_HOST: string;

  import VoiceCreator from "@/components/VoiceCreator.svelte";

  let spaceName = "unknown";
  let creationOpen = false;

  const handleClose = () => {
    creationOpen = false;
  };

//   const conn = new PartySocket({
//   host: PARTYKIT_HOST,
//   room: spaceName,
// });

</script>

<svelte:head>
  <title>{spaceName}</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<div>
  <button on:click={() => (creationOpen = true)}>Create Voice</button>

  <VoiceCreator open={creationOpen} handleClose={handleClose} />
</div>

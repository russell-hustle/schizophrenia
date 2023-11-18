<script lang="ts">
  export let open: boolean;
  export let onClose: () => void;
  export let onVoiceAdd: (voice: Voice) => void;
  import Button, { Label } from '@smui/button';
  import Textfield from '@smui/textfield';
  import IconButton from '@smui/icon-button';

  import { onMount, onDestroy } from 'svelte';

  onMount(() => {
    document.addEventListener("keydown", handleKeyDown);
  });

  onDestroy(() => {
    document.removeEventListener("keydown", handleKeyDown);
  });

  let name = "";
  let personality = "";

  const handleClose = () => {
    onClose();
    name = "";
    personality = "";
  }

  const handleCreate = () => {
    onVoiceAdd({ name, personality });

    handleClose();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose();
    }
  }
</script>

{#if open}
<br/>
<br/>
  <div class="voice-creator">
    <Textfield variant="outlined" bind:value={name} style="width:100%" label="Name" type="text"></Textfield>
    <Button on:click={handleCreate} variant="raised" style="height:100%; margin-left:10px"> <Label>Create</Label> </Button>
      <IconButton class="material-icons" on:click={handleClose} style="height:100%">remove</IconButton >
  </div>

  <div class="voice-creator">
    <Textfield textarea variant="outlined" bind:value={personality} style="width:100%" label="Personality" type="text"></Textfield>
    </div>
{/if}

<style>
  .voice-creator {
    display: flex;
    flex-direction: row;
  }

</style>
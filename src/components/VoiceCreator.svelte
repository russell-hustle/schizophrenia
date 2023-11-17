<script lang="ts">
  export let open: boolean;
  export let handleClose: () => void;
  export let onVoiceAdd: (voice: Voice) => void;

  let name = "";
  let personality = "";

  const handleCreate = () => {
    onVoiceAdd({ name, personality });

    handleClose();
    name = "";
    personality = "";
  };
</script>

{#if open}
  <div class="voice-creator">
    <button on:click={handleClose}>Close</button>
    <h2>Create a voice</h2>
    <input bind:value={name} placeholder="Name" />
    <input bind:value={personality} placeholder="Personality" />
    <button on:click={handleCreate}>Add</button>
  </div>
{/if}

<style>
  .voice-creator {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;
    z-index: 100;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

</style>
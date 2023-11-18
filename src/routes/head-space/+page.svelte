<script lang="ts">
  import PartySocket from "partysocket";

  const PARTYKIT_HOST = "localhost:1999"

  const conn = new PartySocket({
    host: PARTYKIT_HOST,
    room: "my-room",
  });

  import VoiceCreator from "@/components/VoiceCreator.svelte";

  import {getColorName} from '@/utils/colorName';

  let spaceName = "unknown";
  let creationOpen = false;

  let messageText = "";

  let messages: Message[] = [
  ];

  let voices: string[] = [];

  const handleClose = () => {
    creationOpen = false;
  };

  const handleOpenCreation = () => {
    creationOpen = true;
  };

  const handleSendMessage = () => {
    if (messageText === "") {
      return;
    }

    const message: Message = {
      text: messageText,
      user: "User",
    };

    const payload = JSON.stringify({
      type: "message",
      message: message
    });

    conn.send(payload);

    messages = [...messages, message];
    messageText = "";
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  }

  const handleBullshit = () => {
    if (voices.length === 0) {
      return;
    }

    const randomVoice = voices[Math.floor(Math.random() * voices.length)];

    const message: Message = {
      text: 'hey',
      user: randomVoice
    };

    messages = [...messages, message];
  }

  const handleVoiceAdd = (voice: Voice) => {
    voices = [...voices, voice.name];
  }

//   const conn = new PartySocket({
//   host: PARTYKIT_HOST,
//   room: spaceName,
// });

</script>

<svelte:head>
  <title>{spaceName}</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<div id="space">
  <div id="space-header">
    <h2>{spaceName}</h2>
  </div>

  <div id="space-messages">
    <ul>
      {#if messages.length === 0}
      <li class="message" id="placeholder">
        <p class="message-text">
          No messages yet
        </p>
      {/if}
      {#each messages as message}
      <li class="message">
        <p class="message-user"
          style="color: {getColorName(message.user)};"
>{message.user}:</p>
        <p class="message-text">
           {message.text}
        </p>
      </li>
      {/each}
    </ul>
  </div>

  <div id="space-input">
    <input bind:value={messageText} on:keydown={handleKeyDown}  placeholder="Type a message..." type="text" />
    <div id="space-input-messages">
      <button on:click={handleSendMessage}>Send</button>
      <button class="icon" on:click={handleOpenCreation}>+</button>
      <button class="icon" on:click={handleBullshit}>O</button>
    </div>
  </div>

  <VoiceCreator open={creationOpen} onClose={handleClose} onVoiceAdd={handleVoiceAdd} />

</div>

<style lang="scss">

button.icon {
  width: 30px;
  height: 30px;
}

#space {
  overflow: auto;
  flex: 1;
  padding: 16px;
  border: 1px solid black;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  #space-header {
    margin: 0;
  }

  #space-messages {
    flex: 1;
    overflow: auto;
    padding: 16px;
    border: 1px solid black;
    border-radius: 8px;

    ul {
      display: flex;
      flex-direction: column;
      gap: 8px;

      #placeholder {
        opacity: 0.5;
      }

      li.message {
        display: flex;
        gap: 8px;
        padding: 8px;
        border: 1px solid black;
        border-radius: 8px;

        .message-user {
          font-weight: bold;
        }

        .message-text {
          flex: 1;
        }
      }
    }
  }

  #space-input {
    display: flex;
    gap: 16px;

    input {
      flex: 1;
    }

    #space-input-messages {
      display: flex;
      gap: 8px;
    }
  }
}

</style>
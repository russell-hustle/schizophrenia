
<script lang="ts">
  import Button, { Label } from '@smui/button';
  import IconButton from '@smui/icon-button';
  import Textfield from '@smui/textfield';
  import VoiceCreator from "@/components/VoiceCreator.svelte";
  import { Fuck } from '@/utils/buillshit';

  const PARTYKIT_HOST = "localhost:1999"
  const BASE_URL = "http://localhost:1999"

  let user = 'TODO:';

  const conn = new Fuck({
    host: PARTYKIT_HOST,
    room: "voices",
    onMessage: msg => {
      messages = [
        ...messages,
        msg
      ];
    }
  });

  import {getColorName} from '@/utils/colorName';

  let spaceName = "";
  let creationOpen = false;

  let messageText = "";

  let messages: Message[] = [];

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
      type: 'USER',
      user,
    };

    conn.sendMessage(messageText, user)

    messages = [...messages, message];
    messageText = "";

    scrollToBottom();
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  }

  const handleVoiceClear = async () => {

    const url = BASE_URL + '/party/voices';

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        console.error('HTTP Error:', response.status);
      }
    } catch (error) {
      // Handle any errors
      console.error('Fetch Error:', error);
    }

    voices = [];
  }

  const handleGetAllVoices = async () => {
    const url = BASE_URL + '/party/voices';

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        console.error('HTTP Error:', response.status);
      }
    } catch (error) {
      // Handle any errors
      console.error('Fetch Error:', error);
    }
  }

  const handleVoiceAdd = async (voice: Voice) => {
    voices = [...voices, voice.name];

    const payload = JSON.stringify({
      "name": voice.name,
      "personality": voice.personality
    });

    const url = BASE_URL + '/party/voices';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: payload
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        console.error('HTTP Error:', response.status);
      }
    } catch (error) {
      // Handle any errors
      console.error('Fetch Error:', error);
    }
  };

  const scrollToBottom = () => {
    const spaceMessages = document.getElementById('space-messages');
    if (spaceMessages) {
      spaceMessages.scrollTop = spaceMessages.scrollHeight
    }

  }

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
      {#each messages as message}
      <li class="message">
        <p class="message-user"
          style="color: {getColorName(message.type === 'VOICE' ? message.voice.id : message.user)};"
>{message.type === 'VOICE' ? message.voice.name : message.user}:</p>
        <p class="message-text">
           {message.text}
        </p>
      </li>
      {/each}
    </ul>
  </div>

  <div id="space-input">
<Textfield variant="outlined" style="width: 100%;" bind:value={messageText} on:keydown={handleKeyDown} label="Type a message..." type="text">
    </Textfield>
    <div id="space-input-messages">
      <Button on:click={handleSendMessage} variant="raised" style="height:100%"> <Label>Send</Label> </Button>
      <Button on:click={handleVoiceClear} variant="raised" style="height:100%"> <Label>Clear Voices</Label> </Button>
      <IconButton class="material-icons" on:click={handleOpenCreation} style="height:100%"
    >add</IconButton
  >
    </div>
  </div>

  <VoiceCreator open={creationOpen} onClose={handleClose} onVoiceAdd={handleVoiceAdd} />

</div>

<style lang="scss">

button.icon {
  width: 30px;
  height: 30px;
}

.sendButton {
  padding: 10px;
}


#space {
  overflow: auto;
  flex: 1;
  padding: 16px;
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
    border: 1px solid gray;
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
        border-radius: 14px 14px 14px 0;

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
  .input-field-yo {
    width: 800px;
  }
}

</style>
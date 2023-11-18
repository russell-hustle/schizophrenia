<script>
  import Button, { Label } from '@smui/button';
  import { page } from "$app/stores";
  import logo from "$lib/images/schizo.png";
  import github from "$lib/images/github.svg";

  let darkMode = "dark mode";
  const handleToggleTheme = () => {
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");

    if (isDark) {
      darkMode = "dark mode";
      root.classList.remove("dark");
      localStorage.theme = "light";
    } else {
darkMode = "light mode";
      root.classList.add("dark");
      localStorage.theme = "dark";
    }
  }
</script>

<header>
  <div class="toolbar">
    <img id="logo" src={logo} alt="SvelteKit" />
  </div>

  <nav>
      <h2 id="title">SCHIZOPHRENIA</h2>
      
  </nav>

  <div class="toolbar">
    <Button on:click={handleToggleTheme} touch variant="raised" ><Label>{darkMode}</Label></Button>
    <a href="https://github.com/russell-hustle/schizophrenia">
      <img src={github} alt="GitHub" />
    </a>
  </div>
</header>

<style lang="scss">
  header {
    display: flex;
    justify-content: space-between;
  }

  nav {
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 8px;

    text-align: center;

    ul {
      padding: 0;
      list-style: none;
      display: flex;
      gap: 8px;
    }
  }

  .toolbar {
    display: flex;
    gap: 8px;
  }

  #logo {
    height:auto;
    width: 15vw;
    padding-right:-8vw;
  }

  #title {
    font-size: 60px;
  }
</style>

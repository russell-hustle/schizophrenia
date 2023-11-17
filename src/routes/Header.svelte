<script>
  import { page } from "$app/stores";
  import logo from "$lib/images/svelte-logo.svg";
  import github from "$lib/images/github.svg";

  const handleToggleTheme = () => {
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");

    if (isDark) {
      root.classList.remove("dark");
      localStorage.theme = "light";
    } else {
      root.classList.add("dark");
      localStorage.theme = "dark";
    }
  }
</script>

<header>
  <div class="toolbar">
    <a href="https://kit.svelte.dev">
      <img src={logo} alt="SvelteKit" />
    </a>
  </div>

  <nav>
      <h2 id="title">SCHIZOPHRENIA</h2>
      <ul>
        <li aria-current={$page.url.pathname === "/" ? "page" : undefined}>
          <a href="/">Home</a>
        </li>
        <li aria-current={$page.url.pathname === "/about" ? "page" : undefined}>
          <a href="/about">About</a>
        </li>
        <li
          aria-current={$page.url.pathname.startsWith("/sverdle")
            ? "page"
            : undefined}
        >
          <a href="/sverdle">Sverdle</a>
        </li>
        <li
          aria-current={$page.url.pathname.startsWith("/head-space")
            ? "page"
            : undefined}
        >
          <a href="/head-space">Your head</a>
        </li>
      </ul>
  </nav>

  <div class="toolbar">
    <button on:click={handleToggleTheme} >Gang shit toggle</button>
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

</style>

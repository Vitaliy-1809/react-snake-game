import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  html, body, p {
    margin: 0;
    padding: 0;
  }
  *, *::after, *::before {
    box-sizing: border-box;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 
      'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100vh;
    text-rendering: optimizeLegibility;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 
    'Courier New', monospace;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  a {
    font-family: "Helvetica Neue", sans-serif;
    text-decoration: none;
  }

  input {
    outline: none;
  }
`;

export default GlobalStyles;

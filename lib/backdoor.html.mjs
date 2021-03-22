export default `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>TuffyHacks Bot Backdoor</title>
  </head>
  <body>
    <label>Password:</label>
    <input type="text" id="password" />
    <br />
    <label>JSON of emails to add to the whitelist:</label>
    <input type="text" id="whitelist" />
    <button onclick="postCheckins()">submit</button>
    <br />
    <label>JSON of emails to ban (if nothing is entered, this will delete EVERYONE's checkin status.):</label>
    <input type="text" id="blacklist" />
    <button onclick="postCleanup()">submit</button>
    <br />
    <button onclick="getCheckins()">
    GET /checkins
    </button>
    <br />
    <label>Output:</label>
    <pre style="border: 5px solid green;"><code id="output"></code></pre>
    <script>
      const outputRef = document.querySelector("#output"),
        passwordRef = document.querySelector("#password"),
        whitelistRef = document.querySelector("#whitelist"),
        blacklistRef = document.querySelector("#blacklist");
      
      const postCheckins = () =>
        fetch("http://localhost:4242/checkins", {
          method: "POST",
          body: JSON.stringify(JSON.parse(whitelistRef.value)),
          headers: { Authorization: passwordRef.value, "Content-Type": "application/json" },
        })
          .then((res) => res.json())
          .then((json) => (outputRef.textContent = JSON.stringify(json, null, 2)));
      
      const postCleanup = () =>
        fetch("http://localhost:4242/cleanup", {
          method: "POST",
          body: JSON.stringify(JSON.parse(blacklistRef.value)),
          headers: { Authorization: passwordRef.value, "Content-Type": "application/json" },
        })
          .then((res) => res.json())
          .then((json) => (outputRef.textContent = JSON.stringify(json, null, 2)));
      
      const getCheckins = () =>
        fetch("http://localhost:4242/checkins", {
          headers: { Authorization: passwordRef.value },
        })
          .then((res) => res.json())
          .then((json) => (outputRef.textContent = JSON.stringify(json, null, 2)));
    </script>
  </body>`;

export default `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>TuffyHacks Bot Backdoor</title>
    <link rel="stylesheet" href="https://unpkg.com/mvp.css">
  </head>
  <body>
    
    <label>Password:</label>
    <input type="text" id="password" />
    
    <hr />
    
    <label>JSON of emails to add to the whitelist:</label>
    <input type="text" id="whitelist" />
    <button onclick="postCheckins()">submit</button>
    
    <hr />
    
    <label>JSON of emails to ban:</label>
    <input type="text" id="blacklist" />
    <small>If nothing is entered, this will delete EVERYONE's checkin status.</small>
    <button onclick="postCleanup()">submit</button>
    
    <hr />
    
    <button onclick="getCheckins()">
      GET /checkins
    </button>
    
    <hr />
    
    <label>Output:</label>
    <pre style="border: 5px solid green;"><code id="output"></code></pre>
    
    <script>
      const outputRef = document.querySelector("#output"),
        passwordRef = document.querySelector("#password"),
        whitelistRef = document.querySelector("#whitelist"),
        blacklistRef = document.querySelector("#blacklist");
      
      const postCheckins = () =>
        fetch("/checkins", {
          method: "POST",
          body: JSON.stringify(JSON.parse(whitelistRef.value)),
          headers: { Authorization: passwordRef.value, "Content-Type": "application/json" },
        })
          .then((res) => res.json())
          .then((json) => (outputRef.textContent = JSON.stringify(json, null, 2)));
      
      const postCleanup = () =>
        fetch("/cleanup", {
          method: "POST",
          body: JSON.stringify(JSON.parse(blacklistRef.value)),
          headers: { Authorization: passwordRef.value, "Content-Type": "application/json" },
        })
          .then((res) => res.json())
          .then((json) => (outputRef.textContent = JSON.stringify(json, null, 2)));
      
      const getCheckins = () =>
        fetch("/checkins", {
          headers: { Authorization: passwordRef.value },
        })
          .then((res) => res.json())
          .then((json) => (outputRef.textContent = JSON.stringify(json, null, 2)));
    </script>
  </body>`;

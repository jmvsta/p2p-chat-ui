<h1>p2p-chat-ui</h1>
<p>This is server side frontend for peer-to-peer chat [advol-client](https://gitlab.com/asvedr/avdol-client).</p>
<p>To build project you need to have [npm](https://www.npmjs.com) installed</p>
<p>Build for client using 8080 port:<code>npm build:cli80</code></p>
<p>Build for client using 8081 port:<code>npm build:cli81</code></p>
<p>There is build, move & run script for windows located at [Make-Client.ps1](scripts/Make-Client.ps1). Works with advol-client installed</code></p>
<p>Params: </p>
| Parameter Name    | Description                               | Value         |
|-------------------|-------------------------------------------|---------------|
| Port              | advol-client port                         | 8080, 8081    |
| ClientPath        | Path to advol-client project              |               |
| UIPath            | Path to p2p-chat-ui project               |               |
| OutputPath        | Path to place client executable and db    |               |
<p>.\Make-Client.ps1 -Port 8080 -ClientPath "advol-client path" -UIPath "p2p-chat-ui path" -OutputPath "output path" </p>

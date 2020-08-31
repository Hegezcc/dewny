const config = {
  botPrefix: "d!",
  logLevel: {
    console: "info",
    file: "error"
  },
  discordCharacterLimit: 1900, // real limit minus some margin
  admins: [
    // You should change your own Discord ID here!
    "564797346228076555"
  ],
  express: {
    port: 3000,
    frontendHosts: [
      "http://localhost", /^https?:\/\/192\.168\.[0-9]{1,3}\.[0-9]{1,3}$/, // wildcard is allowed too: "*"
    ]
  }
};

export default config;
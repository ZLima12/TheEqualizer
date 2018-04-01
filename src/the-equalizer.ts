import Globals from "./globals";
import EqualizerClient from "./client";

Globals.Options = require("../options");
const client = new EqualizerClient();
client.load().catch((e) => { console.log(e); process.exit(1); }).then(() => client.loginLoop());

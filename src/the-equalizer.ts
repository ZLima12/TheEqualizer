import Globals from "./globals";
import EqualizerClient from "./client";

Globals.Options = require("../options");
const client = new EqualizerClient();
client.load().then(() => client.loginLoop());

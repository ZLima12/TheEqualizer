import Globals from "./globals";
import EqualizerClient from "./client";

Globals.Options = require("../options");
Globals.ClientInstance = new EqualizerClient();
Globals.ClientInstance.load().then(() => Globals.ClientInstance.loginLoop());

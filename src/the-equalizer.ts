import Globals from "./globals";
import Load from "./load";
import EqualizerClient from "./client";

Globals.ClientInstance = new EqualizerClient();

Load().then(() => Globals.ClientInstance.loginLoop());

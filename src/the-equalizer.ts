import Globals from "./globals";
import Load from "./load";

Load().then(() => Globals.ClientInstance.loginLoop());

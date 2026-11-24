import "temporal-polyfill/full/global";
import { createApp } from "./app";
import { CONFIG } from "./config";

const app = createApp();

app.listen(CONFIG.port, CONFIG.host, () => {
	console.log(`Server: http://${CONFIG.host}:${CONFIG.port}`);
});

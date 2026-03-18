import { createApp } from "./src/app.js";
import { PORT } from "./src/config/env.js";

const app = createApp();

app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
})
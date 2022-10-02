import path from 'path';
import { fileURLToPath } from 'url';

import express from "express"


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const website_path = path.join(__dirname, '../public')
const port = process.env.PORT

const app = express()

// Setup static directories
app.use(express.static(website_path))

app.listen(port, () => {
    console.log(`Express server started on port ${port}`)
})
import express from 'express';
import {pool} from './db.js';
import employeesRoutes from './routes/employees.router.js'
import indexRoutes from "./routes/index.routes.js";
import { PORT } from "./config.js";

const app = express()
app.use(express.json())


app.get('/connection',async(req,res)=>{
    const [result] = await pool.query('Select 1 + 1 as result')
    res.json(result[0])
});

app.use(indexRoutes)
app.use('/api',employeesRoutes)

//Respuesta a los end point que no existan
app.use((req, res, next) => {
    res.status(404).json({ message: "Endpoint Not found" });
});

app.listen(PORT);
console.log(`Server on port http://localhost:${PORT}`);
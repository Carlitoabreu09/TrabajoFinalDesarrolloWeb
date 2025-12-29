import express from "express";
import { join, dirname } from "path"; // 1. Aquí ya importaste 'join'
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, 'principal.html')); 
})

app.get("/addclientes", (req, res) => {
    res.sendFile(join(__dirname, 'addclientes.html')); 
})

app.get("/listadofacturas",(req,res)=>{
    res.sendFile(join(__dirname, 'listadofacturas.html')); 

})

app.get("/listadoproductos",(req,res)=>{
        res.sendFile(join(__dirname, 'listadoproductos.html')); 

})


app.set("port", process.env.PORT || 3000);

// Run server
app.listen(app.get("port"), () => {
  console.log(`Server running on =>  http://localhost:${app.get("port")}`);
});
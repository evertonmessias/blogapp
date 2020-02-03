// Módulos
const express = require("express");
const handlebars = require("express-handlebars");
const Handlebars = require("handlebars");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const routes = require("./routes/routes");
const path = require("path");
const PORT = 8080;

//Configurações

//Body Parser
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
//Handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//Mongodb
mongoose.connect("mongodb+srv://root:efc2505xx@cluster0-qjwu2.gcp.mongodb.net/test?retryWrites=true&w=majority")
    .then(() => {
        console.log("*** CONECTADO OK ***");
    })
    .catch(() => {
        console.log("ERRO AO CONECTAR");
    });

//Public
app.use(express.static(path.join(__dirname, "public")));

//Rotas
app.use('/', routes);

//Formato Data
Handlebars.registerHelper('dateFormat', require('handlebars-dateformat'));

//Servidor
app.listen(PORT, () => {
    console.log("SERVIDOR RODANDO NA PORTA:" + PORT);
});
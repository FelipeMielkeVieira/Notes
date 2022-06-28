const express = require("express");

const router = require("./router");

const app = express();
app.use(express.json());

app.use("/api", router);

app.listen(8080, () => {
    console.log("App funcionando na porta 8080");
});
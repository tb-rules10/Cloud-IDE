const express = require("express");

const app = express();

app.listen(5000, () => console.log("Server running on 5000"))

app.get('/', (req, res) => {
  return res.json(
    {
      msg: "Hi from TB!"
    });
})
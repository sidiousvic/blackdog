const express = require("express");

const blackdog = express();

blackdog.use("/blackdog", express.static("public"));

blackdog.listen(9998, () => {
  console.log("Blackdog haunting at port 9998!");
});

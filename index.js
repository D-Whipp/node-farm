const fs = require("fs");
const http = require("http");
const url = require("url");

// *** Files ***

// Blocking, synchronous way
// const textIn = fs.readFileSync("./starter/txt/input.txt", "utf-8");
// console.log(textIn);
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./starter/txt/output.txt", textOut);
// console.log("File written!");

// Non-blocking, asynchronous way
// fs.readFile("./starter/txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("ERROR! 💣");
//   fs.readFile(`./starter/txt/${data1}.txt`, "utf-8", (err, data2) => {
//     if (err) return console.log("ERROR 2! 💣");
//     console.log(data2);
//     fs.readFile("./starter/txt/append.txt", "utf-8", (err, data3) => {
//       if (err) return console.log("ERROR 3! 💣");
//       console.log(data3);

//       fs.writeFile(
//         "./starter/txt/final.txt",
//         `${data2}\n${data3}`,
//         "utf-8",
//         (err) => {
//           console.log("Your file has been written 🙂");
//         }
//       );
//     });
//   });
// });

// console.log("Will read file!");

// *** Server ***
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCT_NAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return output;
};

const templateOverview = fs.readFileSync(
  `${__dirname}/starter/templates/template-overview.html`,
  "utf-8"
);
const templateProduct = fs.readFileSync(
  `${__dirname}/starter/templates/template-product.html`,
  "utf-8"
);
const templateCard = fs.readFileSync(
  `${__dirname}/starter/templates/template-card.html`,
  "utf-8"
);
const data = fs.readFileSync(
  `${__dirname}/starter/dev-data/data.json`,
  "utf-8"
);
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const pathName = req.url;

  // Overview page
  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(templateCard, el))
      .join("");
    // console.log(cardsHtml);
    const output = templateOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);
  } else if (pathName === "/product") {
    // Product page
    res.end("This is the product");
  } else if (pathName === "/api") {
    // API page
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  } else {
    // Not Found
    res.writeHead(404, {
      "Content-type": "text/html",
      "custom-header": "hello-world",
    });
    res.end("<h1>Page not found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});

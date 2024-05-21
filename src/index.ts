import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { getAllFiles } from "./file";
import { generate } from "./utils";
import path from "path";
import { uploadFile } from "./aws";
import { createClient } from "redis";

const publisher = createClient();

async function connectRedis() {
  try {
    await publisher.connect();
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
  }
}

connectRedis();

const app = express();

app.use(cors());
app.use(express.json());
console.log(path.join(__dirname, `output/randomstring`));

// POSTMAN
app.post("/deploy", async (req, res) => {
  const repoUrl = req.body.repoUrl;
  const id = generate(); // asd12

  try {
    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));
    console.log(`Cloned repository to: ${path.join(__dirname, `output/${id}`)}`);

    const files = getAllFiles(path.join(__dirname, `output/${id}`));
    console.log(`Files to upload: ${files}`);

    for (const file of files) {
      const filePath = file.slice(__dirname.length + 1);
      console.log(`Uploading file: ${filePath}`);
      await uploadFile(filePath, file);
    }

    const result = await publisher.lPush("build-queue", id);
    console.log(`Pushed to build-queue: ${result}`);

    res.json({ id: id });
  } catch (error) {
    console.error("Error during deploy:", error);
    res.status(500).json({ error: "Deployment failed" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});






// import express from "express";
// import cors from "cors";
// import simpleGit from "simple-git";
// import { getAllFiles } from "./file";
// import { generate } from "./utils";
// import path = require("path");
// // import path from "path";
// import { uploadFile } from "./aws";
// //uploadFile("falguni/package.json","/Users/bhavi/Desktop/vercel/package.json");
// import { createClient } from "redis";
// const publisher = createClient();
// publisher.connect();



// const app = express();

// app.use(cors())
// app.use(express.json());
// console.log(path.join(__dirname,`output/randomstring`))

// //POSTMAN
// app.post("/deploy",async (req,res) => {
//     const repoUrl = req.body.repoUrl;
//     const id = generate(); //asd12
//     await simpleGit().clone(repoUrl, path.join(__dirname,`output/${id}`));

//     const files = getAllFiles(path.join(__dirname,`output/${id}`));

//     files.forEach(async file => {

//         //from: //users/bhavi/vercel.....//output//13125512/app.js
//         //extract : //output/13125512/app.js
//         await uploadFile(file.slice(__dirname.length + 1),file);    //users/bhavi/vercel...../output/.. (yeh reemove ho jayega )
//     })

//     publisher.lPush("build-queue",id);

//     // console.log(files);
//     // files.forEach(file=>{
//     //     S3.upload
//     // })

//     //put this to s3
//     res.json({
//         id:id
//     })
// });

//     //aws-sdk
//     //sdk.uploadDirToS3()=> no easy way to call this
//     //need to make an array
//     // iterate thru this array one by array
//     //[/falz/users/project/vercel/output/12345/app.tsx]
//     //then call sdk.uploadFile one by one cz there isnt an easy way to upload sdk.folder



// app.listen(3000);

// // function getAllFiles(arg0: any) {
// //     throw new Error("Function not implemented.");
// // }


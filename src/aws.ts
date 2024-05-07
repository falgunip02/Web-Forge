import { S3 } from "aws-sdk";
import fs from "fs";

const s3 = new S3({
    accessKeyId : "",
    secretAccessKey: ""

})

//filename => output/12345/src/App.jsx      // s3 ka file structure hai
//localfilePath => /users//vercel/dist/output/1322516/src/App.jsx    // whrerw can i find this file locally ka path hai 
export const uploadFile = async (fileName: string, localFilePath: string) => {
    // Print a message to indicate that the function is called
    console.log("called");

    // Read the content of the file from the local file system
    const fileContent = fs.readFileSync(localFilePath);

    // Upload the file content to an AWS S3 bucket
    const response = await s3.upload({
        Body: fileContent,          // The content of the file
        Bucket: "myvercell",        // The name of the S3 bucket where the file will be uploaded
        Key: fileName,              // The name/key of the file in the S3 bucket
    }).promise();

    // Print the response from the S3 upload operation
    console.log(response);
}

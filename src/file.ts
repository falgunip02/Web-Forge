import fs from "fs";
import path from "path";

export const getAllFiles = (folderPath: string) => {
    let response: string[] = [];

    console.log("Entering folder:", folderPath);

    const allFilesAndFolders = fs.readdirSync(folderPath);
    allFilesAndFolders.forEach(file => {
        const fullFilePath = path.join(folderPath, file);
        console.log("Processing file/folder:", fullFilePath);
        if (fs.statSync(fullFilePath).isDirectory()) {
            console.log("It's a directory. Recursing into:", fullFilePath);
            response = response.concat(getAllFiles(fullFilePath));
        } else {
            console.log("It's a file. Adding to response:", fullFilePath);
            response.push(fullFilePath);
        }
    });
    return response;
}

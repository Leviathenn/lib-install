/**
 * @author Leviathen
 */
const fs = require('fs-extra');
const JSZip = require("jszip");
const axios = require("axios").default;
const luainjs = require('lua-in-js');
const { exit } = require("process");
const extract = require('extract-zip')
const path = require("path");
const { userInfo } = require('os');
const luaEnv = luainjs.createEnv({
    fileExists: p => fs.existsSync(p),
    loadFile: p => fs.readFileSync(p, { encoding: 'utf8' }),
    osExit: code => (exitCode += code)   // function called by os.exit
}) 
var hasRanComp = false;
const lib = {
    installLibraries: (config)=>{
        if(!hasRanComp){
          //console.log(config);
          //console.log(config.strValues)
          if(config.strValues["requireRoot"]){
            if(isRoot()){
             
            }else{
              console.log("This build requires root."); 
              exit(1);
            }
          }
          (async ()=>{
            try {
  
              if(fs.existsSync(`/home/${userInfo().username}/cache`)){
                fs.rmSync(`/home/${userInfo().username}/weld/cache`,{recursive:true, force:true})
              }
              await extract(`${process.cwd()}/libinst.dat`, { dir: '/tmp/cache' })
              
              fs.readdirSync(`/tmp/cache`).forEach((fDir)=>{
           
                if(!config.strValues["extractPath"]["strValues"][fDir]){
                  
                }else{
                  fs.copySync(`/tmp/cache/${fDir}`,`${config.strValues["extractPath"]["strValues"][fDir]}`)
                }
              })
              console.log('Extraction complete')
            } catch (err) {
              // handle any errors  
            }
          })();
        }else{
          
        }
      
    }
    
}
/**
 * @summary this function compresses the files when called by weld that was specified in the "Stick.json" file.
 */
function isRoot() {
  return !process.getuid(); // getuid() returns 0 for root
}

function addFolderToZip(zip, folderPath) {
  const files = fs.readdirSync(folderPath);

  files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
          addFolderToZip(zip.folder(file), filePath);
      } else if (stat.isFile()) {
          
          zip.file(file, fs.readFileSync(filePath));
      }
  });
}

function compile(funcArg){
  hasRanComp = true;
  let compileDirectory = `${funcArg}/compile`
  fs.readdirSync(compileDirectory).forEach((drinf)=>{
    
    var zip = new JSZip();
    addFolderToZip(zip, `${funcArg}/compile`)
    zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
    .pipe(fs.createWriteStream(`${funcArg}/libinst.dat`))
    .on('finish', function () {
        console.log("Finished Compiling! Run without compile to run your full code.")
    });
  })
}
exports.compile = compile;
exports.lib = lib;


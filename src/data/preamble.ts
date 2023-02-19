export const PREAMBLE = `
(() => {

    globalThis.process = {
      env: {
        NODE_ENV: "dev",
      },
      stdout: {
        isTTY: null
      },
      cwd:() => null
    }
  
    if(typeof fs !== 'undefined') fs.prototype.createWriteStream = () => console.log('createWriteStream')
  
  })()
`;

const { exec } = require("child_process");

function runSpeedTest() {
    return new Promise((resolve, reject) => {
        exec("fast --upload --json", (err, stdout, stderr) => {
            if (err || stderr) {
              console.error("Error while running 'fast --json':", err || stderr);
              reject(err || stderr);
              return;
            }
      
            try {
              const result = JSON.parse(stdout);
              const ip = result.userIp;
              let provedor = 'Desconhecido';
      
              if (ip === '191.13.252.146') {
                provedor = 'Vivo Fibra';
              } else if (ip === '177.80.66.208') {
                provedor = 'Claro Net';
              }
      
              const metrics = {
                "Velocidade Download: ": result.downloadSpeed,
                "Latencia: ": result.latency,
                "Conectado a:": provedor
              };
      
              // console.log('result valor: ' + result.downloadSpeed);

              console.log('SpeedTest.js:' + result.downloadSpeed);

              resolve(result.downloadSpeed);

              // console.log('final da execução:' + metrics["Velocidade Download: "]);
      
            } catch (e) {
              console.error("Error parsing JSON:", e);
              reject(e);
            }
          });
        });
      }

const intervalInMinutes = 4; // 5min = loop of 4 minutes + 1min Ookla server response
setInterval(runSpeedTest, intervalInMinutes * 60 * 1000);

result = runSpeedTest();

module.exports = { runSpeedTest, result };
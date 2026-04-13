const { spawn } = require("child_process");

function predictProfit(inputData) {
  return new Promise((resolve, reject) => {
    const py = spawn("python", [
      "ml/ml_predict.py",
      JSON.stringify(inputData)
    ]);

    let data = "";

    py.stdout.on("data", (chunk) => {
      data += chunk.toString();
    });

    py.on("close", () => {
      resolve(JSON.parse(data));
    });

    py.stderr.on("data", (err) => {
      console.error(err.toString());
    });
  });
}

module.exports = predictProfit;
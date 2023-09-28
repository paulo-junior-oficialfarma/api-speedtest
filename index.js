const express = require('express');
const app = express();
const path = require('path');
const speedTest = require('./Module/SpeedTest');

const metrics = speedTest.runSpeedTest();

const data = speedTest.result.downloadSpeed;

console.log(data);


app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'views')));

app.get('/', async function (req, res) {
  try {
    const metrics = await speedTest.runSpeedTest();

    res.render('index', { data: {object: metrics} });
  } catch (error) {
    res.status(500).send('Error during speed test: ' + error);
  }
});

app.post('/', async (req, res) => {
  try {
    const metrics = await speedTest.runSpeedTest();
    res.render('index', { data: {object: metrics} });
  } catch (error) {
    res.status(500).send('Error during speed test: ' + error);
  }
});

function updateSpeedUI(data) {
  var delay = 5 * 60 * 1000;
  var value = 0;
  var valueStore = 0;
  var tick = 1;
  var tickStore = 1;
  var tickDiff = 0;
  var tickDiffValue = 0;

  console.log(data);


  function valBetween(v, min, max) {
      return Math.min(max, Math.max(min, v));
  }

  (function loop() {
      // Replace '<DOWNLOAD SPEED DATA HERE>' with the actual download speed value from metrics

      // console.log(metrics['Velocidade Download: ']);

      value = Math.ceil(data); // Change 'Velocidade Download:' to the actual key in your metrics object
      tick = valBetween(Math.ceil((value / 100) * 28), 1, 28);
      tickDiff = Math.abs(tick - tickStore);
      tickDiffValue = Math.abs(value - valueStore) / tickDiff;

      var counter = 0;
      var valueStoreTemp = valueStore;
      var tickStoreTemp = tickStore;

      if (value > valueStore) {
          for (var i = tickStoreTemp; i <= tick; i++) {
              (function (i) {
                  setTimeout(function () {
                      $('.speed path:nth-child(' + i + ')').show();
                      $('.speed-label')
                          .css('color', $('.speed path:nth-child(' + i + ')')[0].style.fill)
                          .text(Math.ceil(valueStoreTemp + (tickDiffValue * Math.abs(tickStoreTemp - i))));
                      if (i == tick) { $('.speed-label').text(value); }
                  }, 50 * counter);
                  counter++;
              }(i));
          }
      } else if (value < valueStore) {
          for (var i = tickStoreTemp; i >= tick; i--) {
              (function (i) {
                  setTimeout(function () {
                      $('.speed path:nth-child(' + i + ')').hide();
                      $('.speed-label')
                          .css('color', $('.speed path:nth-child(' + i + ')')[0].style.fill)
                          .text(Math.floor(valueStoreTemp - (tickDiffValue * Math.abs(tickStoreTemp - i))));
                      if (i == tick) { $('.speed-label').text(value); }
                  }, 50 * counter);
                  counter++;
              }(i));
          }
      }
      valueStore = value;
      tickStore = tick;
      setTimeout(loop, delay);
  })();
}

function loop() {
  // Assuming you have a global JavaScript variable 'metrics' containing your speed test data
  updateSpeedUI(data);
  setTimeout(loop, 5 * 60 * 1000);
}

loop();

function runLoop() {
  updateSpeedUI(data);
  setTimeout(runLoop, 5 * 60 * 1000); // Run the loop every 2 seconds
}

runLoop(); // Start the initial execution

app.listen(5500, () => {
    console.log("Server is running on port 5500");
});
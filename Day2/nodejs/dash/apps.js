const express = require('express');
const { DynamoDBClient, ScanCommand } = require('@aws-sdk/client-dynamodb');
const dotenv = require('dotenv');

dotenv.config({ path: ".env"});
const app = express();
const port = 3000;

const awsConfig = {
  region: 'us-east-1',  
  credentials: {
    accessKeyId: "ASIAZQ3DOEAZPDTXX74S",    
    secretAccessKey: "16dc/dkxU8SB3/FVICxUqYjzO9d3sr5eW1CPDuOP",
    sessionToken: "FwoGZXIvYXdzEH8aDNUMaNrQCEfweED3JSLXAR7fvbA26uBsm0PC/X5foywSPBZHdUJxsWmSnbmscuIz5whbgB+M6YcadORoG2RT3unn99Ww6wcPWG376xJrT4yxiHKiZHlYf4IQRCpRsdoTGBJAUBkghEuopyOWyiahRQgRIQeVGyK2xMaxsUlQZgJ0zp3/HLOEjcAjZU9iDCn7XdssTlgWcsDln3JmY4VtbIfNYFooi7KDnG9eOr6VtkV93rXexfWX9+JKMMCvQ6bz5d9udI44FuF5UloaCfsUKTk2XDrvBM6w2neW5R8PEGb48JU6s6LKKOLD264GMi3XDJUr6x2I0ihrYHpFvHbr4HziiCLU0MdOqv6R6hCPfOx/Dbauy/YQU+HMiY0="
  }
};

console.log("AWS_ACCESS_KEY: ", process.env.AWS_ACCESS_KEY)
const dynamoDBClient = new DynamoDBClient(awsConfig);
const tableName = 'sensordb';

app.get('/', async (req, res) => {
  const serverIpv4 = req.connection.localAddress;
  if (!awsConfig.credentials.accessKeyId || !awsConfig.credentials.secretAccessKey) {
    res.send('Missing AWS credentials. Please configure accessKeyId and secretAccessKey.');
  } else {
    try {
      const scanCommand = new ScanCommand({ TableName: tableName });
      const data = await dynamoDBClient.send(scanCommand);

      const responseData = data.Items.map(item => ({
        timestamp: item.timestamp.S,
        humidity: parseFloat(item.humidity.N),
        temperature: parseFloat(item.temperature.N)
      }));

      const labels = responseData.map(item => new Date(parseInt(item.timestamp) * 1000).toLocaleTimeString());
      const humidityValues = responseData.map(item => item.humidity);
      const temperatureValues = responseData.map(item => item.temperature);

      const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>IoT Platform</title>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            .chart-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              margin: 10px;
            }
          </style>
        </head>
        <body>
          
          <div class="container mt-1">
          <h2 style="text-align:center"> IoT Monitoring </h2>
          <h4 style="text-align:center">Server IP Address: ${serverIpv4}</h4>
            <div class="row">
              <div class="col-md-6">
                <div id="humidity-chart" class="p-3"></div>
              </div>
              <div class="col-md-6">
                <div id="temperature-chart" class="p-3"></div>
              </div>
            </div>         
            <h3 style="text-align:center"> LKS 2024 - Cloud Computing</h3>
          </div>
          <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
          <script>
            const labels = ${JSON.stringify(labels)};
            const humidityValues = ${JSON.stringify(humidityValues)};
            const temperatureValues = ${JSON.stringify(temperatureValues)};

            // Create humidity indicator chart using Plotly
            var humidityIndicator = {
              value: humidityValues[0], // Use the last value
              title: {
                text: 'Humidity'
              },
              type: 'indicator',
              mode: 'gauge+number',
              gauge: {
                axis: { range: [0, 100], tickvals: [0, 25, 50, 75, 100] },
                bar: { color: 'rgba(0, 123, 255, 0.8)' },
                bgcolor: 'white',
                borderwidth: 2,
                bordercolor: 'gray',
                steps: [
                  { range: [0, 100], color: 'rgba(0, 123, 255, 0.8)' } // Single color for all ranges
                ]
              }
            };
            var humidityIndicatorLayout = {
              width: 400,
              height: 350
            };

            Plotly.newPlot('humidity-chart', [humidityIndicator], humidityIndicatorLayout);

            // Create temperature indicator chart using Plotly
            var temperatureIndicator = {
              value: temperatureValues[0], // Use the last value
              title: {
                text: 'Temperature'
              },
              type: 'indicator',
              mode: 'number+gauge',
              gauge: {
                axis: { range: [null, 100] },
                bar: { color: 'rgba(255, 99, 132, 0.8)' },
                bgcolor: 'white',
                borderwidth: 2,
                bordercolor: 'gray',
                steps: [
                  { range: [0, 100], color: 'rgba(0, 123, 255, 0.8)' } // Single color for all ranges
                ]
              }
            };

            var temperatureIndicatorLayout = {
              width: 400,
              height: 350
            };

            Plotly.newPlot('temperature-chart', [temperatureIndicator], temperatureIndicatorLayout);

            function createLineChart(elementId, title, xValues, yValues) {
              var trace = {
                x: xValues,
                y: yValues,
                mode: 'lines',
                type: 'scatter',
                name: title
              };
          
              var layout = {
                title: title,
                xaxis: {
                  title: 'Timestamp'
                },
                yaxis: {
                  title: title
                }
              };
          
              Plotly.newPlot(elementId, [trace], layout);
            }
          
          </script>

        </body>
        </html>
      `;

      res.send(html);
      console.log(temperatureValues)
    } catch (err) {
      console.error('Error:', err);
      res.status(500).send('Internal Server Error');
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const http = require('http');

let requestLogs = [];
const server = http.createServer((req, res) => {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    const requestLog = {
	  date : new Date(),
      method: req.method,
      headers: req.headers,
      body: body,
    };
	requestLogs.push(requestLog);

    // Log the request information to the console
    console.log('Incoming Request:\n', JSON.stringify(requestLog, null, 2));
 

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Request logged to console!\n');
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Node request bin is listening on port ${PORT}`);
});




const webPageServer = http.createServer((req, res) => {
 
   const tableRows = requestLogs.map(r => `
    <tr>
	 <td>${r.date.getHours()}:${r.date.getMinutes()}:${r.date.getSeconds()}.${r.date.getMilliseconds()}</td>
      <td>${r.method}</td>
      <td><pre>${JSON.stringify(r.headers, null, 4 )}</pre></td>
      <td><pre>${JSON.stringify(r.body,null,4)}</pre></td>
	  <td>${createCurlString(r)}</td>
    </tr>
  `).join('');
  
  
	 const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Node request bin</title>
    </head>
    <body>
      <h1>Incoming request Table</h1>
      <table border="1">
        <thead>
          <tr>
		    <th>Date</th>
            <th>Method</th>
            <th>Header</th>
            <th>Body</th>
			<th>Curl</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </body>
    </html>
  `;
  
 
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(htmlContent);
 
});

webPageServer.listen(3002, () => {
  console.log('Web page server is listening on port 3002');
});


function createCurlString(requestOptions) {
  const { method, url, headers, body } = requestOptions;

  let curlString = `curl -X ${method} '127.0.0.1:${PORT}'`;

  for (const header in headers) {
    curlString += ` -H '${header}:${headers[header]}'`;
  }

  if (body) {
    curlString += ` -d '${JSON.stringify(body)}'`;
  }

  return curlString;
}
const http = require('http');
const httpProxy = require('http-proxy');
const url = require('url');
const queryString = require('querystring');
const mocks = require('./mocks');
const config = require('./config');

// 创建 HTTP 代理服务器
const proxy = httpProxy.createProxyServer();

// 设置响应头
const setCORSHeader = (res) => {
  // 处理 CORS
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

// 响应调用
const setResponse = (params, req, res) => {
  // 这里为了简单，拿的是url后的地址作为key值
  // 如：/matchURL/queryList
  const key = req.url.split(config.matchURL)[1]; // queryList

  // mocks已经是mocks文件夹下的js所有导出的对象
  // mocks.queryList
  let mock = mocks[key] || null;

  if (mock && typeof mock === 'function') {
    mock = mock(params);
  }

  const responseDataString = JSON.stringify({
    code: 200,
    data: mock,
    msg: '操作成功',
  });

  // 设置响应头
  setCORSHeader(res);
  res.setHeader('Content-Length', Buffer.byteLength(responseDataString));

  // 返回模拟数据
  res.end(responseDataString);
};

const setResponseError = (err, req, res) => {
  console.error(err);
  res.writeHead(500, {
    'Content-Type': 'text/plain;charset=utf-8',
  });
  res.end(`代理服务器出错, ${req.url}`);
};

// 监听端口，拦截请求
const server = http.createServer(function (req, res) {
  try {
    const method = req.method;
    const parsedUrl = url.parse(req.url, true);

    // 拦截除 matchURL 以外的所有请求，转发到目标服务器
    // 这里只有通过includes判断，你也可以更改成更加复杂的判断条件，比如正则
    if (!parsedUrl.pathname.includes(config.matchURL)) {
      proxy.web(req, res, { target: config.proxyURL });
      return;
    }

    // 获取各请求的参数并做返回-------------
    let queryParams = {};
    let postData = {};
    let body = '';
    if (method === 'GET') {
      queryParams = parsedUrl.query;
      setResponse(queryParams, req, res);
    } else if (method === 'POST') {
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const contentType = req.headers['content-type'];
        if (contentType.includes('application/json')) {
          postData = JSON.parse(body);
        } else if (contentType.includes('application/x-www-form-urlencoded')) {
          postData = queryString.parse(body);
        } else {
          postData = {};
        }
        setResponse(postData, req, res);
      });
    } else {
      setCORSHeader(res);
      res.end();
    }
    // -----------------------------------
  } catch (error) {
    setResponseError(error, req, res);
  }
});

proxy.on('error', setResponseError);

// 启动服务器
server.listen(config.port, function () {
  console.log(`Server running at http://localhost:${config.port}/`);
});

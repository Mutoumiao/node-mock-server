# 基于 Node 实现代理请求 Mock 数据教程

本教程将指导您如何使用 Node.js 创建一个简单的代理服务器，实现请求 Mock 数据。这样做的好处是，当您的前端项目还没有与后端 API 完全对接时，您可以使用 Mock 数据进行开发和测试。

## 场景介绍

当我们开发时，总会遇到后端人员还没法提供接口对接时，但是又给出了具体的接口返回与参数数据。那么我们就可以根据启动一个本地服务器的方式来进行`Mock`数据继续模拟请求。这样就完美解决无需等待对接即可完成对应的交互

### Mock方法比较

对于常见的`Mock`方法有很多，比如以下：

- [`ApiFox`](https://www.apifox.com/)、[`ApiPost`](https://www.apipost.cn/)等接口工具

  **优点**：如果你再把后端接口对接上去，就能够更好的统一管理
  
  **缺点**：每个接口想要mock数据都需要请求对应地址（每个接口地址不同，这将会是一个繁琐的操作）

- [`Charles`](https://www.charlesproxy.com/)等抓包工具，通过拦截请求的方式来实现
  
  **优点**：有图形操作，可以拦截任何请求地址并读取该地址并指向任意一个本地json文件来实现mock

  **缺点**：由于时图形操作，因此没有编程方法，没法使用类似`mock.js`等工具，不够灵活

- 在项目的`webpack`、`vite`等打包工具中，通过插件的形式

  **优点**：融合在项目里，容易管理，支持编程手段
  
  **缺点**：上手要求较高，需要有人完整给你项目配置好该服务，而且针对`webpack`每一次的修改配置都需要重新运行，消费时间较高，繁琐

- 自行本地通过`Node`搭建

  **优点**：简单，支持任意编程，任意定制化，可支持多种工具
  
  **缺点**：需要一点点点`javascript`经验

通过上面的简单对比，你或许发现，通过`Node`来搭建的好处，用于本项目使用`nodemon`运行`node`文件，因此可以实时监听修改并重启服务，如同热更新一般，所以会更加简洁快速的修改你需要的逻辑。因此我们准备开始，基于 Node 实现代理请求 Mock 数据

### 功能需求

1.接受请求

2.针对指定地址采用Mock数据

3.非指定地址请求将代理转发到特定地址中

## 环境准备

首先，确保您已安装了以下软件：

Node.js (建议使用 v16.0 或更高版本)

npm (通常与 Node.js 一起安装)

## 创建项目结构

在您的工作目录下，创建一个新的项目文件夹，然后使用 npm 初始化项目：

```bash
mkdir node-proxy-mock
cd node-proxy-mock
npm init -y
```

接下来，安装必要的依赖：

- http-proxy: 一个轻量级的 HTTP 代理服务器库，用于创建代理服务器并将请求代理到其他服务器上。
- mockjs: 一个用于生成随机数据和模拟 AJAX 请求的库，方便前端开发和测试。
- nodemon: 一个实用工具，用于监控 Node.js 应用程序源代码的改动并自动重启服务器，提高开发效率。

```bash
npm install -S http-proxy mockjs
npm install -D nodemon
```

在项目根目录下创建以下文件和文件夹：

```markdown
- node-proxy-mock
  - mocks 存放 mock 数据
    - index.js 获取当前 mocks 文件夹下 js 逻辑
  - config.js 用于配置一些地址
  - index.js 核心代码
```

## 完整示例

[github](https://github.com/Mutoumiao/node-mock-server)

[stackBlitz](https://stackblitz.com/edit/node-x5grdw)

打开后，程序会自动`npm install`

如果没有，请自行在命令行中调用，并且运行`npm run start`

注意：在这里你可不是访问`http://localhost:9090/`地址，而是运行成功后，右边浏览器上的地址，比如：

```
https://nodex5grdw-4v1s-qt1fki8d--9090.local-corp.webcontainer.io
```

你完全可以通过此地址来 mock 你的数据，比如：

```
https://nodex5grdw-4v1s-qt1fki8d--9090.local-corp.webcontainer.io/mockData/queryList
```

> 如果无法打开，你可能需要翻一下这道墙

## 使用方法

### 本地运行

如果你是本地拷贝代码运行的话，那么将使用

```bash
npm install
npm run start
# http://localhost:9090/
```

部署成功后，请将你的项目请求地址改成部署的地址，比如：

```env
VUE_APP_BASE_URL=http://localhost:9090
```

那么整个代理过程就完成了

### stackBlitz运行

通过在`stackBlitz`工具中，你无需在考虑部署问题。你只需将完整的访问地址填写到你的请求地址中，如：

```env
VUE_APP_BASE_URL=https://nodex5grdw-4v1s-qt1fki8d--9090.local-corp.webcontainer.io
```

注意：具体的地址可能有所变化，请根据编辑器右边访问的地址来复制

## 以下代码逻辑

- 创建服务 `http.createServer`
- 创建代理服务 `httpProxy.createProxyServer`，该服务主要用于代理到你非 mock 数据的地址上
- 判断请求的地址，是否符合设置的 `matchURL` 地址
- 如以上地址`不符合`，将转到请求代理服务中
- 如以上地址`符合`, 按照逻辑去找出对应的`mocks`文件夹下的`mock`文件进行返回

## 编写代理服务器代码

```js
// config.js
module.exports = {
  // 服务器端口
  port: 9090,
  // 匹配进入mock的地址，请更改
  matchURL: '/mockData/',
  // 代理地址，请更改
  proxyURL: 'http://127.0.0.1:3333',
};
```

```js
// index.js

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
  res.end(`代理服务器出错，请修改正确地址测试，当前地址： ${req.url}`);
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

```

## 编写读取 mocks 文件夹里的 js 文件

```js
// mocks/index.js
const fs = require('fs');
const path = require('path');

// 获取当前文件夹里的.js文件（忽略index.js），并作为对象进行导出
function getExportsFromJsFiles() {
  const currentDir = __dirname;
  const files = fs.readdirSync(currentDir);
  const jsFiles = files.filter(
    (file) => path.extname(file) === '.js' && file !== 'index.js'
  );
  const exports = {};

  jsFiles.forEach((file) => {
    const fileName = path.basename(file, '.js');
    const fileExports = require(path.join(currentDir, file));

    exports[fileName] = fileExports;
  });

  return exports;
}

module.exports = getExportsFromJsFiles();
```

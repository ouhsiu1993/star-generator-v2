# STAR 報告產生器

這是一個使用 React 前端和 Express 後端構建的應用程序，通過 OpenAI API 生成結構化的 STAR 格式報告。

## 項目結構

```
├── client/               # 前端 React 應用
│   ├── public/           # 靜態文件
│   └── src/              # 源代碼
│       ├── components/   # React 組件
│       ├── pages/        # 頁面組件
│       └── utils/        # 工具函數
└── server/               # 後端 Express 應用
    ├── src/              # 源代碼
    │   ├── config/       # 配置文件
    │   ├── controllers/  # 控制器
    │   ├── routes/       # 路由
    │   └── utils/        # 工具函數
    └── .env              # 環境變量
```

## 安裝和設置

### 前置需求

- Node.js v14+
- npm 或 yarn

### 安裝依賴

1. 安裝前端依賴：

```bash
cd client
npm install
```

2. 安裝後端依賴：

```bash
cd server
npm install
```

### 配置環境變量

1. 在 `server/.env` 文件中設置以下變量：

```
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4.1
TOKEN_LIMIT=1000000
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

2. 在 `client/.env` 文件中設置：

```
REACT_APP_API_URL=http://localhost:5000
```

## 運行應用

### 啟動後端服務

```bash
cd server
npm run dev
```

### 啟動前端應用

```bash
cd client
npm start
```

前端應用將在 http://localhost:3000 啟動，後端服務將在 http://localhost:5000 啟動。

## API 端點

- `POST /api/generate` - 根據提供的故事生成 STAR 報告
- `POST /api/reports` - 儲存報告（占位功能）
- `GET /api/reports` - 獲取儲存的報告（占位功能）

## 功能

- 支持多種商店類別和核心職能
- 實時生成 STAR 格式報告
- 深色/淺色模式切換
- 報告複製功能

## 技術棧

- 前端：React, Chakra UI, Axios
- 後端：Express, OpenAI API
- 開發工具：Nodemon, Dotenv
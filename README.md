# 中国联通“沃宽”客户端NodeJS版

[![npm (scoped)](https://img.shields.io/npm/v/wokuan.svg?maxAge=86400)](https://www.npmjs.com/package/wokuan)

## 介绍

[沃宽](http://wokuan.bbn.com.cn/)是中国联通出品的一款App，其中“带宽提速”功能格外具有亮点。

本项目为该功能的NodeJS版本，主要实现了带宽提速功能。

## 安装

请安装好`NodeJS`环境（包括`npm`），然后执行：

```bash
npm install -g wokuan
```

## 使用

### 推荐：全自动加速

可无限自动续期，一直保持加速状态。

```bash
wokuan auto
```

### 获取基本信息

包括城市、宽带账号等。

```bash
wokuan info
```

### 获取加速

包括剩余时间等。

```bash
wokuan status
```

### 开始加速

开始加速，最多有效时间为15分钟。

```bash
wokuan start
```

### 停止加速

停止加速，但生效有延迟。

```bash
wokuan stop
```

### 更新UUID

立刻更换一个新的UUID。

```bash
wokuan refresh
```

## 参数

### --help

显示帮助信息

### --verbose

详细模式，可以打印出更多信息。

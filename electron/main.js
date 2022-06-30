/*
 * @Author: 寒云 <1355081829@qq.com>
 * @Date: 2022-03-08 15:34:46
 * @LastEditTime: 2022-06-30 10:01:16
 * @LastEditors: 寒云
 * @Description:
 * @FilePath: \electron-vite-vue\electron\main.js
 * @QQ: 大前端QQ交流群: 976961880
 * @QQ2: 大前端QQ交流群2: 777642000
 * @公众账号: 乐编码
 * 善始者实繁 , 克终者盖寡
 * Copyright (c) 2022 by 最爱白菜吖, All Rights Reserved.
 */
const { app, BrowserWindow } = require("electron");
const path = require("path");
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

const NODE_ENV = process.env.NODE_ENV;
let mainWindow;

function createWindow() {
	// 创建浏览器窗口
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
	});

	// 加载 index.html
	// mainWindow.loadFile('dist/index.html') 将该行改为下面这一行，加载url
	mainWindow.loadURL(
		NODE_ENV === "development"
			? "http://localhost:3000"
			: `file://${path.join(__dirname, "../dist/index.html")}`
	);

	// 打开开发工具
	if (NODE_ENV === "development") {
		mainWindow.webContents.openDevTools();
	}
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
	createWindow();
	mainWindow.webContents.session.webRequest.onBeforeSendHeaders(
		(details, callback) => {
			callback({
				requestHeaders: { Origin: "*", ...details.requestHeaders },
			});
		}
	);

	mainWindow.webContents.session.webRequest.onHeadersReceived(
		(details, callback) => {
			callback({
				responseHeaders: {
					"Access-Control-Allow-Origin": ["*"],
					...details.responseHeaders,
				},
			});
		}
	);
	app.on("activate", function () {
		// 通常在 macOS 上，当点击 dock 中的应用程序图标时，如果没有其他
		// 打开的窗口，那么程序会重新创建一个窗口。
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此，通常对程序和它们在
// 任务栏上的图标来说，应当保持活跃状态，直到用户使用 Cmd + Q 退出。
app.on("window-all-closed", function () {
	if (process.platform !== "darwin") app.quit();
});
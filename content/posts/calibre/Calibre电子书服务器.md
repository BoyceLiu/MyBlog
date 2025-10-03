+++
title = "Calibre搭建电子书服务器"
date = "2025-10-03T15:27:09+08:00"
tags = ["Calibre"]
keywords = ["Calibre"]
description = "使用Calibre搭建个人电子书服务器"
showFullContent = false
readingTime = false
hideComments = false
+++

## 1 安装Calibre
在linux主机上执行下面的命令
```
sudo -v && sudo calibre-uninstall && wget -nv -O- https://download.calibre-ebook.com/linux-installer.sh | sudo sh /dev/stdin version=4.23.0
```
> 参考资料：https://calibre-ebook.com/download_linux

## 2 初始化
创建存放电子书文档的目录，并执行下面的命令初始化
```
# 创建库目录
mkdir -p /path/to/your/calibre/library

# 初始化 Calibre 库
calibredb list --library-path /path/to/your/calibre/library
```
导入电子书文档
```
# 导入单个文件
calibredb add book.epub --library-path /home/root/calibre

# 导入多个文件
calibredb add book1.epub book2.pdf book3.mobi --library-path /home/root/calibre

# 导入整个目录
calibredb add /path/to/ebooks/ --library-path /home/root/calibre
```

创建用户
```
# 手动创建用户
calibre-server --manage-users
```

## 3 创建服务
创建文件/etc/systemd/system/calibre-server.service，并加入以下内容
```
[Unit]
Description=Calibre Content Server
After=network.target

[Service]
Type=simple
User=your_username
Group=your_username
ExecStart=/usr/bin/calibre-server --port 8080 --listen-on 0.0.0.0 --enable-auth --auth-mode auto /path/to/your/calibre/library
WorkingDirectory=/home/your_username
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```
your_username，替换为linux用户名  
/path/to/your/calibre/library，替换为存放电子书文档的目录

启动服务 ，执行命令
```
sudo systemctl daemon-reload
sudo systemctl enable calibre-server
sudo systemctl start calibre-server
sudo systemctl status calibre-server
```

## 4 浏览器访问
访问http://youip:8080，输入创建的用户名和密码即可
### 基于Express的本地代理服务器

#### 使用说明
```
node index l=7777 p=9999 u=http://test.com
```
#### 命令行字段说明
* `l=NUMBER` - 输入一个端口号作为代理服务器的启动端口, 默认为7777

* `p=NUMBER` - 输入一个端口号作为允许跨域服务器的端口, 默认为空，一般用于本地启动的服务器


* `u=ADDRESS` - 输入目标跨域的地址
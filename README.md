项目描述
----------------

# 前端工作流程化：frontend-react-projects 脚手架开发

# Changelog

### 连接部署服务器

- 执行部署更新命令

```bash
npm run start:deploy # 进入 部署服务器，显示医院项目列表：

|- 	 
|- 	  浙江省口腔医院-住院医师规培系统.sit Host com-zjkq-master.sit HostName 172.16.150.166 
|- 	  浙江省口腔医院-住院医师规培系统.dev Host com-zjkq-master.dev HostName 172.16.150.164 
|- 	  深圳市儿童医院 Host com-szkid-master.dev HostName 172.16.150.75
end!

# 登录 所属项目目标机器，示例，浙江省口腔医院
ssh com-zjkq-master.dev

# 执行部署操作，即可
./server-deploy.sh com-zjkq-master

```

### 20190413 - 新增 remote远程的publish分支创建配置

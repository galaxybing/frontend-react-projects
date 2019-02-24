项目描述
----------------

# 前端工作流程化：frontend-react-projects 脚手架开发

## 连接部署服务器脚本添加

1. 本地 id_rsa.pub 提交到 169 前端服务器账号：~/.ssh/authorized_keys
2. 脚手架执行： npm run start:deploy
3. 根据显示出来的 config 列表，确认对应部署项目目标域名的名称：

```yaml
# 浙江省口腔医院-住院医师规培系统
Host com-zjkq-master
  HostName 172.16.150.164
  User root
  IdentityFile ~/.ssh/id_rsa
  ForwardAgent yes

# 深圳市儿童医院
Host com-szkid-master
  HostName 172.16.150.153
  User root
  IdentityFile ~/.ssh/id_rsa
  ForwardAgent yes

```

4. 连续执行以下命令，到达目标机器；

```bash
# ssh com-[目标服务器域名的名称]
# 示例，浙江省口腔医院
ssh com-zjkq-master
```

5. 执行部署更新命令： ~/deploy.sh com-[目标服务器域名的名称]


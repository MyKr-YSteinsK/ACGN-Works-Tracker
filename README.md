# ACGN 作品记录管理系统

一个基于 `Java 8 + Servlet + JSP/JDBC + MySQL + jQuery + ECharts` 的轻量级 ACGN 作品记录管理系统，支持注册登录、作品增删改查、统计图表、TOP 展示、CSV 导入导出和多条件搜索。

## 项目分析

这个项目的定位很明确：围绕个人或多用户的 ACGN 作品记录做轻量管理，界面和交互已经具备完整雏形，课程文档也比较齐全。结合源码和文档，当前项目的优点和主要问题如下：

- 优点：功能链路完整，前后端分工清晰，页面交互较丰富，已经具备可展示和可继续迭代的基础。
- 优点：`Servlet + DAO + 前端页面` 结构简单直接，适合作为课程项目和个人作品集展示。
- 问题：数据库连接信息原先直接写在仓库配置里，不适合公开到 GitHub。
- 问题：密码原先以明文方式存储，和需求文档中“密码加密存储”的目标不一致。
- 问题：前端原先硬编码部署路径 `/ACGN_FF_war`，换上下文路径后容易无法访问。
- 问题：仓库中混入了 `target/` 等构建产物，不适合直接作为源码仓库提交。

## 本次优化

本轮已补上的内容：

- 密码存储改为 `SHA-256` 哈希，并兼容已有明文数据登录。
- 用户名增加格式校验，避免动态建表时把非法字符拼进表名。
- 数据库配置支持通过 `System Property` 或环境变量覆盖，便于本地和部署环境分离。
- 前端页面与接口调用去掉固定上下文路径，提升部署兼容性。
- 重写初始化 SQL，保留最小可运行表结构和少量示例数据。
- 增加 `.gitignore`，避免把构建产物和 IDE 文件提交到 GitHub。

## 技术栈

- 后端：Java 8、Servlet 4、JDBC、Jackson、OpenCSV
- 前端：HTML、CSS、JavaScript、jQuery、Bootstrap、ECharts
- 数据库：MySQL 8
- 构建：Maven WAR 项目

## 目录说明

```text
src/main/java         Java 源码
src/main/resources    数据库配置与初始化 SQL
src/main/webapp       页面、脚本、样式和静态资源
pom.xml               Maven 配置
```

## 运行方式

1. 创建 MySQL 数据库并执行 [`src/main/resources/init_work_admin.sql`](/E:/CS/Git/ACGN-FF/src/main/resources/init_work_admin.sql)。
2. 复制 [`src/main/resources/db.properties.example`](/E:/CS/Git/ACGN-FF/src/main/resources/db.properties.example) 的内容到本地 `db.properties`，填写自己的数据库账号密码。
3. 或者直接通过以下方式覆盖数据库配置：

```powershell
$env:ACGN_DB_URL="jdbc:mysql://localhost:3306/acgn?useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai"
$env:ACGN_DB_USERNAME="root"
$env:ACGN_DB_PASSWORD="your_password"
```

4. 构建项目：

```powershell
mvn clean package
```

5. 将生成的 WAR 包部署到 Tomcat。
6. 打开登录页，先注册一个新用户再使用系统。

## 文档参考

仓库根目录中的这些文档可以辅助理解设计背景：

- `需求分析书.docx`
- `数据库设计.docx`
- `项目页面截图.docx`
- `ACGN作品记录管理系统吴永城小组计划书.docx`
- `ACGN作品记录管理系统吴永城开发实践总结.docx`

其中需求文档强调了多用户数据隔离、复合筛选、统计展示和轻量化体验，这些目标与当前代码实现基本一致。

## 后续可继续优化

- 把“每个用户一张作品表”重构为“单表 + user_id”模式，降低维护成本。
- 为搜索和统计接口补单元测试或集成测试。
- 增加统一过滤器，处理登录校验、字符编码和异常响应。
- 把前端中重复的请求路径、通知组件和弹窗逻辑进一步抽成公共模块。

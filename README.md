# Next.js 订阅支付启动器

这是一个高性能 SaaS 应用程序的一体化启动套件。

## 功能特性

- 使用 [Supabase](https://supabase.io/docs/guides/auth) 进行安全的用户管理和身份验证
- 基于 PostgreSQL 的强大数据访问和管理工具，由 [Supabase](https://supabase.io/docs/guides/database) 提供
- 集成 [Stripe Checkout](https://stripe.com/docs/payments/checkout) 和 [Stripe 客户门户](https://stripe.com/docs/billing/subscriptions/customer-portal)
- 通过 [Stripe webhooks](https://stripe.com/docs/webhooks) 自动同步定价计划和订阅状态

## 演示

- https://subscription-payments.vercel.app/

[![演示截图](./public/demo.png)](https://subscription-payments.vercel.app/)

## 架构

![架构图](./public/architecture_diagram.png)

## 逐步设置

部署此模板时，步骤顺序很重要。请按照以下步骤操作以启动和运行。

### 开始部署

#### Vercel 部署按钮

[![使用 Vercel 部署](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnextjs-subscription-payments&env=NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,STRIPE_SECRET_KEY&envDescription=输入您的 Stripe API 密钥。&envLink=https%3A%2F%2Fdashboard.stripe.com%2Fapikeys&project-name=nextjs-subscription-payments&repository-name=nextjs-subscription-payments&integration-ids=oac_VqOgBHqhEoFTPzGkPd7L0iH6&external-id=https%3A%2F%2Fgithub.com%2Fvercel%2Fnextjs-subscription-payments%2Ftree%2Fmain)

Vercel 部署将在您的 GitHub 账户上使用此模板创建一个新的仓库，并指导您创建一个新的 Supabase 项目。[Supabase Vercel 部署集成](https://vercel.com/integrations/supabase)将设置必要的 Supabase 环境变量，并运行 [SQL 迁移](./supabase/migrations/20230530034630_init.sql)以在您的账户上设置数据库架构。您可以在项目的[表格编辑器](https://app.supabase.com/project/_/editor)中检查创建的表格。

如果自动设置失败，请[创建一个 Supabase 账户](https://app.supabase.com/projects)，并在需要时创建一个新项目。在您的项目中，导航到 [SQL 编辑器](https://app.supabase.com/project/_/sql)，并从快速启动部分选择"Stripe Subscriptions"启动模板。

### 配置身份验证

按照[此指南](https://supabase.com/docs/guides/auth/social-login/auth-github)设置 GitHub OAuth 应用程序，并配置 Supabase 使用它作为身份验证提供者。

在您的 Supabase 项目中，导航到 [auth > URL 配置](https://app.supabase.com/project/_/auth/url-configuration)，并将您的主要生产 URL（例如 https://your-deployment-url.vercel.app）设置为站点 URL。

接下来，在您的 Vercel 部署设置中，添加一个名为 `NEXT_PUBLIC_SITE_URL` 的新**生产**环境变量，并将其设置为相同的 URL。确保取消选择预览和开发环境，以确保预览分支和本地开发正常工作。

#### [可选] - 为部署预览设置重定向通配符（如果您通过部署按钮安装，则不需要）

如果您通过上面的"部署到 Vercel"按钮部署了此模板，可以跳过此步骤。Supabase Vercel 集成将为您设置重定向通配符。您可以通过转到 Supabase [身份验证设置](https://app.supabase.com/project/_/auth/url-configuration)来检查这一点，您应该在"重定向 URL"下看到一个重定向列表。

否则，为了使身份验证重定向（电子邮件确认、魔法链接、OAuth 提供者）在部署预览中正常工作，请导航到[身份验证设置](https://app.supabase.com/project/_/auth/url-configuration)并将以下通配符 URL 添加到"重定向 URL"：`https://*-username.vercel.app/**`。您可以在[文档](https://supabase.com/docs/guides/auth#redirect-urls-and-wildcards)中阅读更多关于重定向通配符模式的信息。

如果您通过上面的"部署到 Vercel"按钮部署了此模板，可以跳过此步骤。Supabase Vercel 集成将为您运行数据库迁移。您可以通过转到 [Supabase 项目的表格编辑器](https://supabase.com/dashboard/project/_/editor)来检查这一点，并确认有包含种子数据的表格。

否则，导航到 [SQL 编辑器](https://supabase.com/dashboard/project/_/sql/new)，粘贴 [Supabase `schema.sql` 文件](./schema.sql)的内容，然后点击运行以初始化数据库。

#### [可能可选] - 设置 Supabase 环境变量（如果您通过部署按钮安装，则不需要）

如果您通过上面的"部署到 Vercel"按钮部署了此模板，可以跳过此步骤。Supabase Vercel 集成将为您设置环境变量。您可以通过转到 Vercel 项目设置并点击"环境变量"来检查这一点，您会看到一个环境变量列表，旁边显示 Supabase 图标。

否则，导航到 [API 设置](https://app.supabase.com/project/_/settings/api)并将它们粘贴到 Vercel 部署界面中。复制项目 API 密钥并粘贴到 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 和 `SUPABASE_SERVICE_ROLE_KEY` 字段中，复制项目 URL 并粘贴到 Vercel 的 `NEXT_PUBLIC_SUPABASE_URL` 中。

恭喜，这完成了 Supabase 设置，快完成了！

### 配置 Stripe

接下来，我们需要配置 [Stripe](https://stripe.com/) 来处理测试支付。如果您还没有 Stripe 账户，现在创建一个。

对于以下步骤，请确保您已打开["测试模式"开关](https://stripe.com/docs/testing)。

#### 创建 Webhook

我们需要在 Stripe 的 `Developers` 部分创建一个 webhook。如上面的架构图所示，这个 webhook 是连接 Stripe 和您的 Vercel 无服务器函数的部分。

1. 在[测试端点页面](https://dashboard.stripe.com/test/webhooks)上点击"添加端点"按钮。
2. 输入您的生产部署 URL，后跟 `/api/webhooks` 作为端点 URL。（例如 `https://your-deployment-url.vercel.app/api/webhooks`）
3. 在"选择要监听的事件"标题下点击`选择事件`。
4. 在"选择要发送的事件"部分点击`选择所有事件`。
5. 复制`签名密钥`，因为我们在下一步需要它（例如 `whsec_xxx`）（/!\ 注意不要复制 webhook id we_xxxx）。
6. 除了我们在部署期间早些时候设置的 `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` 和 `STRIPE_SECRET_KEY` 之外，我们还需要将 webhook 密钥添加为 `STRIPE_WEBHOOK_SECRET` 环境变量。

#### 使用新的环境变量重新部署

为了使新设置的环境变量生效并使所有内容正确协同工作，我们需要在 Vercel 中重新部署我们的应用。在您的 Vercel 仪表板中，导航到部署，点击溢出菜单按钮并选择"重新部署"（不要启用"使用现有构建缓存"选项）。一旦 Vercel 重新构建并重新部署了您的应用，您就可以设置您的产品和价格信息了。

#### 创建产品和定价信息

您的应用程序的 webhook 监听 Stripe 上的产品更新，并自动将它们传播到您的 Supabase 数据库。因此，在您的 webhook 监听器运行的情况下，您现在可以在 [Stripe 仪表板](https://dashboard.stripe.com/test/products)中创建您的产品和定价信息。

Stripe Checkout 目前支持在特定间隔内收取预定金额的定价。尚不支持更复杂的计划（例如，不同的定价层或席位）。

例如，您可以创建具有不同定价层的商业模型，例如：

- 产品 1：业余爱好
  - 价格 1：每月 10 美元
  - 价格 2：每年 100 美元
- 产品 2：自由职业者
  - 价格 1：每月 20 美元
  - 价格 2：每年 200 美元

可选地，为了加快设置，我们添加了一个[固定文件](fixtures/stripe-fixtures.json)，用于在您的 Stripe 账户中引导测试产品和定价数据。[Stripe CLI](https://stripe.com/docs/stripe-cli#install) 的 `fixtures` 命令执行此 JSON 文件中定义的一系列 API 请求。只需运行 `stripe fixtures fixtures/stripe-fixtures.json`。

**重要：**确保您已正确配置了 Stripe webhook 并使用所有必需的环境变量重新部署。

#### 配置 Stripe 客户门户

1. 在[设置](https://dashboard.stripe.com/settings/branding)中设置您的自定义品牌
2. 配置客户门户[设置](https://dashboard.stripe.com/test/settings/billing/portal)
3. 打开"允许客户更新他们的支付方式"
4. 打开"允许客户更新订阅"
5. 打开"允许客户取消订阅"
6. 添加您想要的产品和价格
7. 设置所需的业务信息和链接

### 就是这样

我知道，这确实需要很多步骤，但这是值得的。您现在已经准备好从您的客户那里赚取经常性收入了。🥳

## 本地开发

如果您还没有这样做，请将您的 Github 仓库克隆到您的本地机器。

### 安装依赖

确保您已安装 [pnpm](https://pnpm.io/installation)，然后运行：

```bash
pnpm install
```

接下来，使用 [Vercel CLI](https://vercel.com/docs/cli) 链接您的项目：

```bash
pnpm dlx vercel login
pnpm dlx vercel link
```

`pnpm dlx` 从注册表运行一个包，而不将其安装为依赖项。或者，您可以全局安装这些包，并删除 `pnpm dlx` 部分。

如果您不打算使用本地 Supabase 实例进行开发和测试，您可以使用 Vercel CLI 下载开发环境变量：

```bash
pnpm dlx vercel env pull .env.local
```

运行此命令将在您的项目文件夹中创建一个新的 `.env.local` 文件。出于安全考虑，您需要从 [Supabase 仪表板](https://app.supabase.io/)（`Settings > API`）手动设置 `SUPABASE_SERVICE_ROLE_KEY`。如果您不使用本地 Supabase 实例，您还应该在 `package.json` 中的 `supabase:generate-types` 脚本中将 `--local` 标志更改为 `--linked` 或 `--project-id <string>`。（参见 -> [https://supabase.com/docs/reference/cli/supabase-gen-types-typescript]）

### 使用 Supabase 进行本地开发

强烈建议使用本地 Supabase 实例进行开发和测试。我们在 `package.json` 中为此提供了一组自定义命令。

首先，您需要安装 [Docker](https://www.docker.com/get-started/)。您还应该复制或重命名：

- `.env.local.example` -> `.env.local`
- `.env.example` -> `.env`

接下来，运行以下命令以启动本地 Supabase 实例并运行迁移以设置数据库架构：

```bash
pnpm supabase:start
```

终端输出将为您提供访问 Supabase 堆栈中不同服务的 URL。Supabase Studio 是您可以对本地数据库实例进行更改的地方。

复制 `service_role_key` 的值，并将其粘贴为 `.env.local` 文件中 `SUPABASE_SERVICE_ROLE_KEY` 的值。

您可以随时使用以下命令打印出这些 URL：

```bash
pnpm supabase:status
```

要将您的本地 Supabase 实例链接到您的项目，请运行以下命令，导航到您上面创建的 Supabase 项目，并输入您的数据库密码。

```bash
pnpm supabase:link
```

如果您需要重置数据库密码，请前往[您的数据库设置](https://supabase.com/dashboard/project/_/settings/database)，点击"重置数据库密码"，这次将其复制到密码管理器中！😄

🚧 警告：这将我们的本地开发实例链接到我们用于`生产`的项目。目前，它只有测试记录，但一旦它有客户数据，我们建议使用[分支](https://supabase.com/docs/guides/platform/branching)或手动创建一个单独的`预览`或`暂存`环境，以确保您的客户数据不会在本地使用，并且可以在发布到`生产`之前彻底测试架构更改/迁移。

一旦您链接了您的项目，您可以使用以下命令拉取您在远程数据库中所做的任何架构更改：

```bash
pnpm supabase:pull
```

您可以使用以下命令用您在远程数据库中添加的任何数据为本地数据库播种：

```bash
pnpm supabase:generate-seed
pnpm supabase:reset
```

🚧 警告：这是从`生产`数据库播种数据。目前，这只包含测试数据，但一旦其中包含真实的客户数据，我们建议使用[分支](https://supabase.com/docs/guides/platform/branching)或手动设置一个`预览`或`暂存`环境。

您可以在本地 Supabase Studio 中对数据库架构进行更改，并运行以下命令生成与您的架构匹配的 TypeScript 类型：

```bash
pnpm supabase:generate-types
```

您还可以使用以下命令自动生成一个包含您对本地数据库架构所做的所有更改的迁移文件：

```bash
pnpm supabase:generate-migration
```

并使用以下命令将这些更改推送到您的远程数据库：

```bash
pnpm supabase:push
```

记住在将更改部署到`生产`之前，要在您的`本地`和`暂存`或`预览`环境中彻底测试您的更改！

### 使用 Stripe CLI 测试 webhooks

使用 [Stripe CLI](https://stripe.com/docs/stripe-cli) [登录到您的 Stripe 账户](https://stripe.com/docs/stripe-cli#login-account)：

```bash
pnpm stripe:login
```

这将打印一个 URL，供您在浏览器中导航并提供对您的 Stripe 账户的访问权限。

接下来，启动本地 webhook 转发：

```bash
pnpm stripe:listen
```

运行此 Stripe 命令将向控制台打印一个 webhook 密钥（例如，`whsec_***`）。在您的 `.env.local` 文件中将 `STRIPE_WEBHOOK_SECRET` 设置为此值。如果您还没有这样做，您还应该使用 Stripe 仪表板中的**测试模式**（！）密钥在 `.env.local` 文件中设置 `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` 和 `STRIPE_SECRET_KEY`。

### 运行 Next.js 客户端

在另一个终端中，运行以下命令以启动开发服务器：

```bash
pnpm dev
```

请注意，webhook 转发和开发服务器必须在两个单独的终端中同时运行，应用程序才能正常工作。

最后，在浏览器中导航到 [http://localhost:3000](http://localhost:3000) 以查看渲染的应用程序。

## 上线

### 归档测试产品

在上线之前，归档所有测试模式的 Stripe 产品。在创建您的实时模式产品之前，请确保按照以下步骤设置您的实时模式环境变量和 webhooks。

### 配置生产环境变量

要在实时模式下运行项目并使用 Stripe 处理支付，请将 Stripe 从"测试模式"切换到"生产模式"。您的 Stripe API 密钥在生产模式下会有所不同，您将不得不创建一个单独的生产模式 webhook。复制这些值并将它们粘贴到 Vercel 中，替换测试模式值。

### 重新部署

之后，您需要重新构建您的生产部署以使更改生效。在您的项目仪表板中，导航到"部署"选项卡，选择最近的部署，点击溢出菜单按钮（在"访问"按钮旁边）并选择"重新部署"（不要启用"使用现有构建缓存"选项）。

要验证您是否在生产模式下运行，请使用 [Stripe 测试卡](https://stripe.com/docs/testing) 测试结账。测试卡应该不起作用。

---

Started supabase local development setup.

         API URL: http://127.0.0.1:54321
     GraphQL URL: http://127.0.0.1:54321/graphql/v1

S3 Storage URL: http://127.0.0.1:54321/storage/v1/s3
DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
Studio URL: http://127.0.0.1:54323
Inbucket URL: http://127.0.0.1:54324
JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
S3 Access Key: 625729a08b95bf1b7ff351a663f3a23c
S3 Secret Key: 850181e4652dd023b7a98c58ae0d2d34bd487ee0cc3254aed6eda37307425907
S3 Region: local

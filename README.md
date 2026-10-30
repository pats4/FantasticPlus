# Fantastic+（FantasticPlus）

**[简体中文](README.md)** · [English](README.en.md)

> Steam Deck 风扇曲线插件。它在 [Fantastic](https://github.com/NGnius/Fantastic) 的基础上**重做**了曲线编辑与配置管理，并补上了原版没有的安全保护 —— 不是跟随上游的分支，而是基于原版的二次改进版。

![version](https://img.shields.io/badge/version-0.7.0-blue)
![platform](https://img.shields.io/badge/platform-SteamOS%20%2F%20Steam%20Deck-1a9fff)
![license](https://img.shields.io/badge/license-GPL--3.0-green)

---

## 安装

### URL 安装（推荐）

Decky 支持直接给一个 zip 链接安装，以后升级也走同一条链接：

**① 复制这个地址**

~~~~
https://github.com/IceyVanci/FantasticPlus/releases/latest/download/FantasticPlus.zip
~~~~

**② Decky Loader → 右上角 ⚙ 设置 → 开发者（Developer）→ 「通过 URL 安装插件 / Install Plugin from URL」**

**③ 粘贴地址 → 安装**，完成后重启 Decky（或用 Decky 设置里的「重新加载插件」）

**④ 回到游戏模式 → Quick Access（⋯）→ Fantastic+**

> 也可以在 [Releases](https://github.com/IceyVanci/FantasticPlus/releases) 页面下载 zip，用「从文件安装」，效果相同。

### 手动安装

1. 下载 `FantasticPlus.zip`
2. 解压到 `~/homebrew/plugins/`，得到 `~/homebrew/plugins/FantasticPlus/`
3. 重启 Decky Loader

> 插件启动时会自动修复 `bin/backend` 的可执行位，所以 URL 安装、或解压时丢了权限，都不需要额外 `chmod`。

---

## 快速开始

1. QAM → Fantastic+
2. 把「模式」滑块拨到 **手动** —— 此时插件会停止 `jupiter-fan-control` 并接管风扇（另外几档是固定 50% / 75% / 100%）
3. 点「✎ 编辑曲线」画一条曲线，或直接点下面的配置卡片切换
4. 想交还 SteamOS：把滑块拨回 **系统默认**

**配置文件** `~/.config/fantasticplus/fantastic.json` ・ **日志** `/tmp/fantasticplus.log`

---

## 功能

### 曲线编辑器

- 大画布（约 840×380），10 °C 一格网格，当前温度竖线，左上角实时显示当前温度与输出百分比
- **端点保持**：低于首点、高于末点保持端点值，不外推
- **点击空白加点 / 点击节点删点**，带圆形命中判定，缩放窗口不会错位
- **线性插值** 开关在主面板「配置槽位」下方，任何模式下都能切换：开 = 直线连接，关 = 阶梯（保持左点值）
- **最左边的点是风扇起转温度**，固定为 0%（只要温度在 80 °C 以上，则取下限值）

### 死区与安全下限

曲线**永远不会**进入"高温 + 低转速"的死区：

| 温度 | 最低转速 |
|---|---|
| ≤ 80 °C | 无下限 |
| 80 → 90 °C | 40% → 60%（线性） |
| 90 → 95 °C | 60% → 100%（线性） |
| ≥ 95 °C | 100% |

- 死区画成斜线网纹，边界是一条红线
- 曲线一旦低于下限就**自动沿死区边缘走**，并以**虚线**绘制，表示"这一段被下限顶住了"
- 在死区里点击加点时，点会**自动贴到边缘**并给出提示，不会产生非法点
- 后端每秒控速时还会再钳一次，配置里存着旧曲线也突破不了下限
- **手动固定速度（50% / 75% / 100%）同样受这条下限约束**：92 °C 选 50% 会被抬到 80%

### 配置槽位

- 多套曲线保存、一键切换，槽位直接以卡片形式显示在主面板
- **卡片点一次 = 选中（高亮），再点一次 = 打开查看 / 编辑**；插件没接管风扇时也能这样操作
- 自定义槽位可编辑、可删除（默认槽位受保护）
- 「配置槽位」弹窗里可以新建、编辑、应用

### 系统曲线（只读参考）

- 内置 **Jupiter / Galileo** 两套 SteamOS 官方曲线；选中时插件**直接复算 Valve 的二次函数**，而不是使用采样点
- 查看时是**只读参考**：空心节点 + 红字"仅供参考，无法修改"，因为后端根本不读这些点
- 死区标注同样说明"只对自定义曲线生效" —— 系统算法不受本插件下限约束

### 其它

- 中英文切换（主面板底部滑块）
- 转速显示带百分比（按 7000 / 9000 RPM 机型量程换算）
- 设置原子写入，坏配置文件自动备份

---

## 安全机制

插件会接管风扇，因此内置了这些保护：

| 机制 | 行为 |
|---|---|
| **重启复位** | 用内核 `boot_id` 识别真正的重启（睡眠 / 唤醒不算）。重启后强制回到**系统默认**，不保留接管状态与槽位选中态 |
| **温度地板** | 见上面的死区表，曲线、固定速度与编辑器三处钳位 |
| **退出 / 崩溃保护** | 收到 SIGTERM / SIGINT / SIGHUP 或发生 panic 时，主动把风扇交还 `jupiter-fan-control.service` |
| **写入看门狗** | 连续 5 次写 `fan1_target` 失败（例如 SteamOS 改了接口）就停止接管、交还 SteamOS |
| **启动对账** | 检测到另一个风扇控制器占用 44444 端口时，直接拒绝接管 |
| **无自动探针** | 安装完不会自动动风扇，必须由你显式选择模式 |
| **单点保护** | 曲线少于 2 个点时后端拒绝控速并交还 SteamOS，避免"全温域 0%"把风扇停死 |

一句话：**任何异常情况下，温控都不能处于无人管理的状态。**

---

## 相比原版改了什么

| 问题 | 原版 | Fantastic+ |
|---|---|---|
| 重复 x 值插值除零 | 得到 NaN，`NaN as u64 = 0`，**风扇停转** | 插值前先去重并钳位，绝不输出非有限值 |
| 配置文件脏数据 | 无校验，越界点载入后锁死 | 载入即 sanitize，坏文件自动备份 |
| 设置写入 | 直接覆盖，断电可能写出半截 JSON | 原子写入 |
| 机型量程 | 统一按 7000 RPM | 按 CPU 型号区分 7000 / 9000 |
| `recalculate` 属性 | SteamOS 3.7+ 已移除，日志刷错 | 自动降级，只依赖 `fan1_target` |
| 缩放后点击错位 | 按固定尺寸算坐标 | `getBoundingClientRect` + clamp |
| 面板卡在 Loading | 后端未就绪时竞态 | 改为可 await 的就绪状态 |
| 每秒枚举 CPU | 每 tick 全量扫描 | 量程缓存 |
| 高温保护 | 无 | 死区 + 双重钳位 + 看门狗 + 崩溃交还 |
| 配置管理 | 单条曲线 | 多槽位 + 快速卡片 + 只读系统曲线 |

---

## 与原版共存

插件标识为 **FantasticPlus**，从路径到端口都和原版完全隔离，可以一起安装：

| 项目 | 原版 Fantastic | Fantastic+ |
|---|---|---|
| 插件目录 | `~/homebrew/plugins/Fantastic` | `~/homebrew/plugins/FantasticPlus` |
| 后端端口 | 44444 | **44445** |
| 配置文件 | `~/.config/fantastic/fantastic.json` | `~/.config/fantasticplus/fantastic.json` |
| 运行日志 | `/tmp/fantastic.log` | `/tmp/fantasticplus.log` |
| 前端存储 | `fantastic.*` | `fantasticplus.*` |

> 两者都会接管 `jupiter-fan-control.service`，**不要同时开启**双方的风扇接管，否则会互相争夺控制权。

---

## 已知限制

- SteamOS 的温控实际是**带滞回的状态机**（`fan_hysteresis` 700、`ec_ramp_rate` 10、最短运行时间 120 s、功耗前馈），本插件是温度直接映射，动态表现不会完全一致
- 只读 CPU（`acpitz`）一路传感器，SteamOS 实际取 CPU / GPU / SSD 三者最大值
- 仅支持 Steam Deck（LCD / OLED）

---

## 机型支持（LCD / OLED）

| 机型 | APU | 识别方式 | 风扇量程 |
|---|---|---|---|
| Steam Deck LCD | Aerith · AMD Custom APU 0405 | CPU 型号字符串 | 1 – 7000 RPM |
| Steam Deck OLED | Sephiroth · AMD Custom APU 0932 | CPU 型号字符串 | 1 – 9000 RPM |

- hwmon 与温度传感器都是**按能力查找**的（需要 `fan1_input` / `fan1_target` / `fan1_label` 三个属性），不写死 hwmon 序号，两种机型都能自动找到
- 面板布局在两种机型上完全一致（同为 1280×800），OLED 上不会变形或溢出
- **OLED 用户请在「配置槽位」里选 Galileo**：Galileo 是 OLED 的板型配置，Jupiter 是 LCD 的，选错就会套上另一块板的风扇曲线
- 若某机型实际转速上限低于上表数值，曲线顶部会提前饱和，面板百分比按上表量程换算（只影响显示，不影响控速）

---

## 从源码构建

~~~~bash
# 1. WASM 绑定（只有改过 proto 才需要）
cd src/rust
RUSTFLAGS="--cfg aes_compact" wasm-pack build --target web --features decky
python3 scripts/generate_embedded_wasm.py

# 2. 前端
cd ../..
pnpm install
pnpm build                      # -> dist/index.js

# 3. 后端（静态链接，不依赖 SteamOS 的 glibc）
cd backend-rs
cargo build --release --target x86_64-unknown-linux-musl
cp target/x86_64-unknown-linux-musl/release/fantastic-rs ../bin/backend
~~~~

依赖路径需与 `backend-rs/Cargo.toml` 一致：[usdpl-rs](https://github.com/NGnius/usdpl-rs)、[nRPC](https://github.com/NGnius/nRPC)、[sysfs-nav](https://github.com/NGnius/sysfs-nav)。

---

## 致谢与许可

- 原始项目：[NGnius/Fantastic](https://github.com/NGnius/Fantastic)（GPL-3.0），本项目保留其全部原始版权声明
- 开发协助：本项目借助 **DeepSeek-V4.1-Flash** 模型与 **DeepSeek Harness** 智能体环境完成重构、调试与文档撰写
- 依赖：[usdpl-rs](https://github.com/NGnius/usdpl-rs)、[nRPC](https://github.com/NGnius/nRPC)、[sysfs-nav](https://github.com/NGnius/sysfs-nav)、[decky-frontend-lib](https://github.com/SteamDeckHomebrew/decky-frontend-lib)

本项目同样以 **GPL-3.0** 发布，详见 [LICENSE](./LICENSE)。

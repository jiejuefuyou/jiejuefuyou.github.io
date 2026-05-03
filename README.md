# AutoApp

24/7 自主 iOS 应用开发 + 多变现 funnel 项目根目录. CC 在此管理所有相关代码与编排.

## 当前里程碑 (2026-05-02 下午 tick #44)

- ✅ **4 款 iOS App scaffold** (AutoChoice / AltitudeNow / DaysUntil / PromptVault) — CI 全绿
- ✅ **ASC bootstrap 解锁** — 9 fail 死循环 → SSH deploy key 路径, 0 用户操作
- ✅ **AutoChoice TestFlight build #9 ASC VALID** — 等用户 install (build #10 v1.0.1 在跑, 破 Apple stale cache)
- ✅ **3 sibling 仓 init_signing first-try success** — alt/days/vault cert ready, 推 v0.1.0 即一次成
- ✅ **B2B conversion 工具 LIVE** — services / quote-calculator / case-studies / ROI calc (jiejuefuyou.github.io)
- ✅ **Gumroad 4 SKU LIVE** — Master / Indie / Creator / Marketer ($7-12)
- ✅ **memory P0 规则 6 条** — 协作模式持续优化

## 目录结构

```
autoapp/
├── README.md           ← 你正在看
├── INBOX/              ← 用户操作清单 (60- 是 master, 其他历史)
│   ├── 60-USER-ACTION-MASTER-LIST.md   ⭐ single source of truth (5/2 重写)
│   ├── 80-week-master-action-30min-daily.md   当前周 (5/2-5/8)
│   ├── STATUS.md       ← 最新 tick
│   ├── TICK-N-DELIVERABLES-INDEX.md  各 tick 产出
│   └── archive/2026-05/  过时文档归档
├── orchestrator/       ← 编排 + 自动化脚本
│   ├── RESUME.md       ← CC 重新进入 entry point
│   ├── state.yml       ← 4 App + hard_gates 单源真相
│   ├── revenue_dashboard.sh   daily funnel snapshot
│   ├── weekly_review.sh       周一决策脚本
│   ├── setup_asc_internal_tester.py  一行命令 wire 任何 app TestFlight tester
│   └── verify_all.sh   4 仓硬要求 verify
├── reports/            ← 113+ paste-ready 内容 (公众号/Substack/知乎/dev.to/LinkedIn/朋友圈)
├── products/           ← Gumroad SKU + B2B 咨询资产
│   ├── gumroad-skus/   4 SKU + bundle 战略
│   └── b2b-ai-consulting/  FAQ 30 问 + verified case 模板 + cold email 5 类
├── site/               ← jiejuefuyou.github.io (4 LIVE pages)
├── wechat-miniprogram/ ← v1.0.11 (160 prompts, 等提审)
├── scrapers/           ← B 站 + 小红书数据采集
└── repos/              ← (deprecated, 实际 4 个 iOS 仓在 GitHub jiejuefuyou/autoapp-*)
```

## 4 款 iOS App 状态

| App | 仓 | 类别 | 状态 |
|---|---|---|---|
| AutoChoice (决策轮盘) | [autoapp-hello](https://github.com/jiejuefuyou/autoapp-hello) | Lifestyle | TestFlight v1.0.1 (build #10 跑中, 等 install) |
| AltitudeNow (海拔气压) | [autoapp-altitude-now](https://github.com/jiejuefuyou/autoapp-altitude-now) | Health & Fitness | cert ready, hold 30 day ASO 后推 |
| DaysUntil (事件倒数) | [autoapp-days-until](https://github.com/jiejuefuyou/autoapp-days-until) | Productivity | cert ready, 同 hold |
| PromptVault (160 prompts) | [autoapp-prompt-vault](https://github.com/jiejuefuyou/autoapp-prompt-vault) | Productivity | cert ready, 同 hold |

## 关键身份

- Apple Developer (账户持有人) `sh1990914@hotmail.com`
- GitHub `jiejuefuyou@gmail.com` (org `jiejuefuyou`)
- ASC API Key `3X8QYT8TJR` (.p8 在本地)
- TestFlight tester `sh1990914@hotmail.com` (in `Internal Testers` group)
- 私有 cert 仓 [autoapp-certs](https://github.com/jiejuefuyou/autoapp-certs) (SSH deploy key + match storage)

## 协作约定

- bypassPermissions 模式, CC 全程自主
- 用户硬门 (memory feedback_minimal_user_interaction P0): 身份/付款/Apple 必须邮件接受/最终验收
- 凭证类一次到位, CC 严禁让用户重生成 token
- 终端输出经济: 所有 Bash 必 grep+head 过滤, 不 dump full JSON/log
- 文档生命周期: ship 新文档前 grep 同主题, 过时即归档 INBOX/archive/

## 进入 session 的 3 步

1. 看 [INBOX/STATUS.md](INBOX/STATUS.md) 顶部 tick — 1 min 知道最新进度
2. 看 [INBOX/60-USER-ACTION-MASTER-LIST.md](INBOX/60-USER-ACTION-MASTER-LIST.md) — 知道当下该做什么
3. 看 [orchestrator/RESUME.md](orchestrator/RESUME.md) — CC 重启 entry point + tick 历史

## 监控

- daily: `bash orchestrator/revenue_dashboard.sh`
- weekly (周一): `bash orchestrator/weekly_review.sh`
- TestFlight tester wire (任何 app): `python orchestrator/setup_asc_internal_tester.py com.jiejuefuyou.<bundle>`

---

最后更新: 2026-05-02 tick #44 (ASC SSH 解锁 + 文档清理 + 跨仓验证)

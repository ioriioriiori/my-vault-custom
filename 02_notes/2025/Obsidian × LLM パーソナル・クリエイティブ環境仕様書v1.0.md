---
tags:
  - note
  - better-obsidian
  - 企画書
  - 仕様書
---
> [!IMPORTANT]
> [[企画書の書き方]]を参照の下、企画書を書くこと。
> 自己レビューの際は、[[企画書のレビュー基準]]を参照してください。
> タグ、noteルール追加は[[設計、運用ルール、タグ仕様]]へ。

# Obsidian × LLM パーソナル・クリエイティブ環境 仕様書 v1.0

> **Scope** : BoardGame 企画・研究レポート・Idea/Twitter メモ・Daily Note・ブラウザクリップ・小説執筆を **1 Vault** または **分割 Vault** で運用し、OpenAI API（Pi Gateway）で自動生成/校閲・ダッシュボード・検索・家族共有までカバーする。

---

## 1. フォルダ／Vault 戦略

### 1.1 統合 Vault 構造

```text
myVault/
├─ 00_rules/               # 誤編集禁止 (immutable docs)
├─ 01_inbox/               # QuickAdd 一時箱
├─ 02_projects/
│   ├─ BoardGames/
│   │    └─ Hello_Conductor/
│   │         ├─ drafts/
│   │         ├─ tests/          # テストプレイログ (1 file / session)
│   │         ├─ assets/         # 画像・PDF
│   │         └─ versions/       # rulebook_v0.1.md など
│   ├─ Research/
│   │    └─ <topic>/...
│   ├─ Novel_World/
│   └─ LLM_outputs/              # 生成物保管
├─ 03_memos/                    # Thino outputs (YYYY/MM/DD.memos.md)
├─ 04_daily/                    # Periodic Notes
├─ 05_clippings/                # Surf/MarkDownload → 自動タグ
├─ 06_prompts/                  # Text‑Generator YAML
├─ 07_templates/                # Templater md/kanban/quickadd JSON
├─ 08_scripts/                  # DataviewJS / Macro / Python helper
├─ 09_dashboards/               # Dataview & Tracker 集計
└─ 10_config/                   # .env / plugin JSON (Git ignored)
```

### 1.2 分割 Vault パターン

| Vault           | 主目的         | 共有               | LLM Key            |
| --------------- | ----------- | ---------------- | ------------------ |
| **BG_Vault**    | BoardGames  | Family Read‑only | Pi Gateway API Key |
| **Res_Vault**   | Research    | Private          | Personal API Key   |
| **Idea_Vault**  | Thino memos | Private          | Personal API Key   |
| **Novel_Vault** | Fiction     | Private          | Personal API Key   |

> ZIP テンプレと GitHub レポ (branch per vault)。`.vault.json` でプラグイン一括インポート。

---

## 2. プラグイン & 自動化レイヤ

|#|区分|プラグイン|主要設定|備考|
|---|---|---|---|---|
|1|AI 生成|**Text‑Generator**|Provider=`OpenAI` (Base URL=Pi) / Default=`gpt-4o-mini` / Output=`02_projects/LLM_outputs`|Presets in 06_prompts/|
|2|校閲メタ追記|**MetaEdit**|Post‑run hook → `llm.task / model / tokens`|–|
|3|メモ|**Thino**|Hotkey ⌘⌥T / Storage=`03_memos` / Daily merge|–|
|4|タスク|**Kanban**|board at `02_projects/BoardGames/kanban.md`|QuickAdd "New Task" macro|
|5|集計|**Dataview** + **Tracker**|Dashboards in 09_dashboards|–|
|6|クリップ|**Surf** + **MarkDownload**|auto‑folder=`05_clippings` / frontmatter: `source_url` `tags`|Custom JS to auto‑tag domain|
|7|引用|**obsidian‑citation‑plugin**|export dir=`bib/` per topic|BibTeX autoappend|
|8|整形|**Obsidian‑Linter**|saveOnFileChange=true|–|
|9|自動振分|**QuickAdd** + **DataviewJS**|Macro `classify_send.js`|see 08_scripts|

Legend : **✅=プラグイン完結 / 🔧=簡易スクリプト / 🛠=カスタム実装**

---

## 3. LLM プロンプトセット (06_prompts)

|File|用途|主モデル|概要|
|---|---|---|---|
|`balance_check.yml`|ボドゲ数値・効果整合性検査|gpt‑4o-mini|入力: rulebook section / 出力: 不整合・提案 tbl|
|`academic_proofread.yml`|レポート校閲|gpt‑4o|Academic tone, `[??]` で引用指示|
|`story_expand.yml`|世界観・シーン追加|gpt‑4o-mini|指定段落を 2 倍に膨らませる|
|`idea_cluster.yml`|Thino 週次クラスタリング|gpt‑4o-mini|tag cloud + 上位3派生案|
|`weekly_digest.yml`|ダッシュボード GPT 要約|gpt‑4o-mini|STATS JSON → human readable|

---

## 4. 自動分類 & タグ付けワークフロー

1. **Text‑Generator** で生成 → 保存先は必ず `02_projects/LLM_outputs/<date>_<task>.md`。
    
2. MetaEdit hook で frontmatter 追記。
    
3. QuickAdd コマンド「Classify & Send」
    
    - ユーザがトグル ✅ 完了した段落を検出。
        
    - DataviewJS スクリプト `classify_send.js` が`llm.task` と rule‑based 解析で送り先決定（BoardGames / Research / etc）。
        
    - 移動後 `origin: llm` タグ追加。タイトルに `(AI)` サフィックス。
        

---

## 5. ダッシュボード仕様 (09_dashboards)

### 5.1 Obsidian 内

`weekly_dashboard.md` (DataviewJS)

```dataviewjs
// 書き込みヒートマップ
renderHeatmap("03_memos or 04_daily", 7);
// 新規企画書レビュー待ち
dv.table(["File","Status"],dv.pages("02_projects/BoardGames").where(p=>p.status=="review"));
// LLM コスト
const costJPY = dv.pages("02_projects/LLM_outputs").reduce((t,p)=> t + (p.llm.total_tokens/1000000*155*1.2),0);
dv.paragraph(`💰 今週推定コスト: ¥${costJPY.toFixed(0)}`);
```

Cron: QuickAdd Scheduler → `weekly_digest.yml` を走らせ最後に dash 再描画。

### 5.2 Pi Streamlit `/dashboard`

- `usage.csv` → 日別折れ線、モデル別円グラフ
    
- BoardGames progress Kanban (読み取り専用 JSON)
    
- Family quota progress bars
    

---

## 6. Raspberry Pi LLM Gateway

|Component|Tech|Note|
|---|---|---|
|API Server|**FastAPI**|`/chat` `/search` `/assist` endpoints (async)|
|Auth|JWT + (opt) mutual‑TLS|per‑user quota stored SQLite|
|Embedding DB|ChromaDB|Obsidian md reindexed on Git pull|
|Web UI|**Streamlit**|`/dashboard` uses pandas + matplotlib|
|Deploy|systemd + Caddy + Cloudflare Tunnel|HTTPS default|

Repo: `pi-llm-gateway/` with Dockerfile (python:3.11‑slim). Volume mount Vault read‑only.

---

## 7. NotebookLM 連携

- Google Drive → `02_projects/BoardGames/` & `Research/` symlink sync.
    
- `notebooklm.json` keeps mapping {folder: notebook_id}.
    
- Make command `make sync_notebooklm` pushes latest MD list via Gemini API (🛠 custom script).
    

---

## 8. セットアップ手順

```bash
# 1. clone template
git clone https://github.com/yourname/obsidian-llm-starter myVault
cd myVault && ./setup.sh  # installs .vault.json, scripts
# 2. configure API keys
cp 10_config/.env.sample 10_config/.env  # edit PI_URL, API_KEY
# 3. enable plugins inside Obsidian (CMD-P: ‘Reload plugins’)
# 4. deploy Pi server
ssh pi@raspberrypi "bash -s" < deploy.sh
```

---

## 9. 技術カバー表

|機能|工数|実現手段|
|---|---|---|
|テンプレ生成 / 校閲 / ルールチェック|✅|Templater + Text‑Generator Preset|
|LLM 出力振分け|🔧|QuickAdd Macro + DataviewJS `classify_send.js`|
|Surf ブックマーク自動タグ|🔧|community plugin hook + JS snippet|
|Dashboard (Obsidian)|✅|Dataview + Tracker|
|Dashboard (Pi)|🔧|Streamlit script `app_dashboard.py`|
|NotebookLM Auto‑sync|🛠|Google Drive API + Gemini API script|
|家族 quota 管理 UI|🛠|Streamlit sub‑page + JWT claim|

---

## 10. TODO / 次アクション

1. **QuickAdd Macro 実装** (`classify_send.js`, `new_test_session.js`).
    
2. **Streamlit app_dashboard.py** – token/cost graph.
    
3. **NotebookLM sync script** – prototype.
    
4. Surf hook: domain‑to‑tag mapping JSON.
    
5. family quota UI & limits enforcement.
    
6. beta test with BG_Vault + Pi Gateway.
    

> _Last update: 2025‑04‑28 17:30 JST_
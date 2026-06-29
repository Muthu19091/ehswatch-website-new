---
name: deploy
description: Deploy a local folder to Quick Host and get a preview link. Use when the user says deploy, host, publish, or share a project.
argument-hint: [folder-path] [project-name]
allowed-tools: Bash
---

# Quick Host Deploy

Deploy a local folder to Quick Host file hosting service.

## Usage

`/deploy /path/to/folder project-name`

If no project name is given, use the folder name. Token should come from env var `$QH_DEPLOY_TOKEN` if set, otherwise use the one below.

## ⚠️ CRITICAL: Before creating a new project — ASK THE USER

**You MUST ask the user these two questions before deploying a new project:**

1. **Client name?** (e.g. "Shriram", "Mana", "EHS Watch", "KP", "Eicher", "Merusri", "Odigma")
2. **Project name/purpose?** (e.g. "Commercial landing page", "Brand website", "Independence day campaign")

Then construct the project name as: `{client}-{purpose}` in lowercase with hyphens.

Examples:
- Client "Shriram", purpose "Commercial landing page" → `shriram-commercial-lp`
- Client "Mana", purpose "Right Life v2" → `mana-rightlife-v2`
- Client "Eicher", purpose "Independence day" → `eicher-independence-day`

**NEVER guess generic names like `my-app`, `test`, `landing-page`, `portfolio`.** If the user hasn't given enough context, ASK them.

**Before deploying, ALWAYS check existing projects:**
```bash
curl -s "https://preview.odigma.ooo/api/projects?token=$TOKEN" | python3 -c "import json,sys;[print(p['name'],'by',p['created_by']) for p in json.load(sys.stdin)['projects']]"
```

If a similar project name already exists, **ask the user**: "Update existing `X` or create new `Y`?"

### Valid naming format
`{client}-{type}-{variant}` — all lowercase with hyphens
- ✅ `shriram-commercial-lp`
- ✅ `mana-rightlife-v2`
- ✅ `merusri-developers`
- ✅ `eicher-independence-day`

### Forbidden names (will be rejected by API)
- ❌ `my-app`, `app`, `project`, `test`, `dummy`, `temp`, `new-project`, `untitled`, `sample`
- ❌ Names under 5 characters (`tvs`, `app`, `lp`)
- ❌ Generic single words without client context (`portfolio`, `landing`)
- ❌ TitleCase or UPPERCASE (`Merusri-Developers` → use `merusri-developers`)
- ❌ Underscores (use hyphens: `eicher-independence-day` not `eicher_independence_day`)
- ❌ Spaces, special chars

### When in doubt
**Always ask the user** for the client name and project purpose. Don't guess generic names like `my-app`.

## Deploy Command

**New project (first deploy):**
```bash
PROJECT_NAME="$1"
[ -z "$PROJECT_NAME" ] && PROJECT_NAME=$(basename "$0")
TOKEN="${QH_DEPLOY_TOKEN:-qh_96457e375245c37f1011b92207bcfc3e}"
cd "$0" && zip -r /tmp/qh-deploy.zip . -q && curl -s -X POST "https://preview.odigma.ooo/api/deploy-zip/${PROJECT_NAME}" -H "x-deploy-token: $TOKEN" -F "zip=@/tmp/qh-deploy.zip" && rm /tmp/qh-deploy.zip
```

**Update existing project (re-deploy):**
```bash
TOKEN="${QH_DEPLOY_TOKEN:-qh_96457e375245c37f1011b92207bcfc3e}"
cd "$0" && zip -r /tmp/qh-deploy.zip . -q && curl -s -X POST "https://preview.odigma.ooo/api/deploy-zip/${PROJECT_NAME}?force=true" -H "x-deploy-token: $TOKEN" -F "zip=@/tmp/qh-deploy.zip" && rm /tmp/qh-deploy.zip
```

**Dry run (preview changes without deploying):**
```bash
curl -s -X POST "https://preview.odigma.ooo/api/deploy-zip/PROJECT_NAME?dry_run=true" -H "x-deploy-token: $TOKEN" -F "zip=@/tmp/qh-deploy.zip"
```
Returns `adds`, `overwrites`, `unchanged` counts without committing.

## After Deploy

Always show the preview link: `https://preview.odigma.ooo/PROJECT_NAME/`

## Update a Single File

```bash
curl -s -X POST "https://preview.odigma.ooo/api/deploy/PROJECT_NAME" -H "x-deploy-token: $TOKEN" -F "files=@./path/to/file.html"
```

For files in subfolders:
```bash
curl -s -X POST "https://preview.odigma.ooo/api/deploy/PROJECT_NAME" -H "x-deploy-token: $TOKEN" -F "files=@./assets/css/style.css;filename=assets/css/style.css"
```

## Auto-Update Skill

Every API response includes a `_meta` field with the current skill version:
```json
{
  "_meta": {
    "skillVersion": "a3f8c1d2",
    "skillUpdatedAt": "2026-05-11T12:34:56.000Z",
    "refreshSkill": "https://preview.odigma.ooo/api/skill?token=YOUR_TOKEN"
  }
}
```

**IMPORTANT:** If the `skillVersion` in a response differs from your previous version, the skill has been updated. Fetch the latest skill before proceeding:
```bash
curl -s "https://preview.odigma.ooo/api/skill?token=$TOKEN" > ~/.claude/skills/deploy/SKILL.md
```

This keeps the skill current without manual sharing.

## Post-Deploy Verification

### Step 1: Sync check (local vs server comparison)
Generate a local manifest and compare with server:
```bash
# Generate local manifest
find . -type f -exec md5sum {} \; | awk '{print "{\"path\":\"" substr($2,3) "\",\"hash\":\"" $1 "\",\"size\":" }' > /dev/null
# Or send manifest to sync endpoint:
curl -s -X POST "https://preview.odigma.ooo/api/deploy/PROJECT_NAME/sync" -H "x-deploy-token: $TOKEN" -H "Content-Type: application/json" -d '{"files":[{"path":"index.html","hash":"abc123","size":1234}]}'
```
This returns: `needsUpload` (local files not on server), `needsDownload` (server files not local), `changed` (different content).

**IMPORTANT:** This is the real sync check. Use this to verify all files are uploaded correctly.

### Step 2: Reference check (broken asset detection)
```bash
curl -s "https://preview.odigma.ooo/api/deploy/PROJECT_NAME/diagnose?token=$TOKEN"
```
This only checks if HTML/JS/CSS references point to existing files. It does NOT compare local vs server.

## File Operations

**List all files recursively with hashes:**
```bash
curl -s "https://preview.odigma.ooo/api/deploy/PROJECT_NAME/files?recursive=true&token=$TOKEN"
```

**List files in a specific subfolder:**
```bash
curl -s "https://preview.odigma.ooo/api/deploy/PROJECT_NAME/files?path=images&token=$TOKEN"
```

**Check if a file exists (HEAD request):**
```bash
curl -sI "https://preview.odigma.ooo/api/deploy/PROJECT_NAME/file/images/hero.jpg" -H "x-deploy-token: $TOKEN"
```
Returns `X-File-Hash` and `X-File-Size` headers.

**Read file content (clean, no injected scripts):**
```bash
curl -s "https://preview.odigma.ooo/api/deploy/PROJECT_NAME/read?file=index.html&token=$TOKEN"
```

**Move/rename a file:**
```bash
curl -s -X PUT "https://preview.odigma.ooo/api/deploy/PROJECT_NAME/move" -H "x-deploy-token: $TOKEN" -H "Content-Type: application/json" -d '{"from":"old/path/file.html","to":"new/path/file.html"}'
```

**Bulk move multiple files:**
```bash
curl -s -X POST "https://preview.odigma.ooo/api/deploy/PROJECT_NAME/bulk-move" -H "x-deploy-token: $TOKEN" -H "Content-Type: application/json" -d '{"moves":[{"from":"file1.png","to":"images/file1.png"},{"from":"file2.png","to":"images/file2.png"}]}'
```

**Delete a file inside a project:**
```bash
curl -s -X DELETE "https://preview.odigma.ooo/api/deploy/PROJECT_NAME/file" -H "x-deploy-token: $TOKEN" -H "Content-Type: application/json" -d '{"path":"wrong-file.png"}'
```

**Delete entire project:** Not available via API. Use the dashboard.

## Other Commands

**List all projects:**
```bash
curl -s "https://preview.odigma.ooo/api/projects?token=$TOKEN"
```

**QR code for mobile testing:**
```bash
curl -s "https://preview.odigma.ooo/api/qr/PROJECT_NAME"
```

**Version history:**
```bash
curl -s "https://preview.odigma.ooo/api/versions/PROJECT_NAME?token=$TOKEN"
```

**Rollback:**
```bash
curl -s -X POST "https://preview.odigma.ooo/api/versions/PROJECT_NAME/rollback" -H "x-deploy-token: $TOKEN" -H "Content-Type: application/json" -d '{"version":"VERSION_FILENAME"}'
```

**Auto-expire:**
```bash
curl -s -X PUT "https://preview.odigma.ooo/api/projects/PROJECT_NAME/expiry" -H "x-deploy-token: $TOKEN" -H "Content-Type: application/json" -d '{"days":30}'
```

## Error Codes

| HTTP | Code | Meaning |
|------|------|---------|
| 400 | BAD_REQUEST | Invalid input |
| 401 | UNAUTHORIZED | Invalid or missing token |
| 403 | FORBIDDEN | Action not allowed (e.g., delete project via API) |
| 404 | NOT_FOUND | Project or file not found |
| 409 | CONFLICT | Project exists, use force=true |
| 413 | PAYLOAD_TOO_LARGE | File exceeds 500MB limit |
| 429 | TOO_MANY_REQUESTS | Rate limited |
| 500 | SERVER_ERROR | Internal error |

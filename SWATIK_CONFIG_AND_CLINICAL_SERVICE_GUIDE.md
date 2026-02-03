# Step-by-step: Find config volume, apply Swastik config, fix Clinical Service

Follow these steps in order. Use **PowerShell** (or Windows Terminal).

---

## Part 1: Find your config volume name with `docker volume ls`

### Step 1.1: Open PowerShell

- Press **Win + X** → choose **Windows PowerShell** or **Terminal**.
- Or: press **Win + R**, type `powershell`, press Enter.

### Step 1.2: Run the command (from any folder)

You can run this from **any folder**; it lists all Docker volumes on your machine.

```powershell
docker volume ls
```

### Step 1.3: What you see

Example output:

```
DRIVER    VOLUME NAME
local     bahmni-lite_bahmni-config
local     bahmni-lite_openmrsdbdata
local     bahmni-lite_reportsdbdata
...
```

### Step 1.4: Pick the config volume

- You need the volume that holds **bahmni config** (whiteLabel, app configs).
- In the `.env` you have **CONFIG_VOLUME=bahmni-config**.
- Docker Compose creates a volume named: **`<project-folder>_<CONFIG_VOLUME>`**.
- So look for a volume whose name:
  - **Contains** `bahmni-config`, and
  - Often starts with the folder name (e.g. `bahmni-lite_`).

**Typical name:** `bahmni-lite_bahmni-config`

- If your project folder has a different name, the prefix changes (e.g. `bahmni-work_bahmni-config`).
- **Write down the exact volume name** — you will use it in Part 2.

---

## Part 2: Copy Swastik config into the config volume

This replaces/merges config so the landing page shows “Swastik Hospital” and the **Clinical Service** link points to the clinical app.

### Step 2.1: Use the correct path to config-sample

The **config-sample** folder is inside **openmrs-module-bahmniapps**, not inside bahmni-lite. So you must either run the command **from** that folder, or use the **full path** to config-sample.

### Step 2.2: Copy config into the volume

**Option A – Run from the UI app folder (recommended)**

First go to the folder that **contains** config-sample:

```powershell
cd "c:\Users\athar\Downloads\bahmni-work\bahmni-work\openmrs-module-bahmniapps"
```

Check that config-sample exists:

```powershell
dir config-sample\openmrs
```

You should see `apps` (and inside it `openmrs\apps\home\...`). Then run (replace volume name if different):

```powershell
docker run --rm -v bahmni-lite_bahmni-config:/data -v "${PWD}/config-sample:/source" alpine sh -c "cp -r /source/openmrs /data/"
```

**Option B – Run from any folder using full path**

If you are in bahmni-lite or anywhere else, use the **full path** to config-sample:

```powershell
docker run --rm -v bahmni-lite_bahmni-config:/data -v "c:/Users/athar/Downloads/bahmni-work/bahmni-work/openmrs-module-bahmniapps/config-sample:/source" alpine sh -c "cp -r /source/openmrs /data/"
```

(Use forward slashes `/` in the path, or escape backslashes. Replace `bahmni-lite_bahmni-config` with your volume name if different.)

- **`-v YOUR_CONFIG_VOLUME_NAME:/data`** — mounts your config volume at `/data` in the container.
- **`-v "${PWD}/config-sample:/source"`** — mounts your `config-sample` folder as `/source`.
- **`cp -r /source/openmrs /data/`** — copies `openmrs` (and its contents) into the config volume.

If it works, you get no output (or a brief line). If you see “no such volume”, fix the volume name from Part 1.

### Step 2.3: Restart the web container so it loads the new config

```powershell
cd "c:\Users\athar\Downloads\bahmni-work\bahmni-work\bahmni-docker\bahmni-lite"
docker compose --env-file .env restart bahmni-web
```

Wait until it says the container has restarted.

### Step 2.4: Refresh the landing page

1. Open the app: **https://localhost** (or **http://localhost**).
2. Do a **hard refresh**: **Ctrl + F5** (or Ctrl + Shift + R).
3. You should see:
   - “WELCOME TO SWASTIK HOSPITAL” (or similar from config).
   - Footer with “Swastik Hospital Help”.
   - **Clinical Service** link that goes to the clinical app (see Part 3).

---

## Part 3: Fix Clinical Service opening a blank page

Clinical Service should open the **login page** at `/bahmni/home/index.html#/login`. The sample config already sets this; below is how it works and how to check it.

### Step 3.1: What was wrong

- The landing page gets the **Clinical Service** link from **whiteLabel.json** → **landingPage**.
- If the link was wrong (e.g. `../clinical/index.html` or another path), the browser went to a bad URL and showed a blank page.
- The sample config sets the Clinical Service link to: **`/bahmni/home/index.html#/login`**.

### Step 3.2: What the sample config does

File: **`openmrs-module-bahmniapps\config-sample\openmrs\apps\home\whiteLabel.json`**

In **landingPage**, the first card (Clinical Service) has:

```json
{
  "enabled": true,
  "title": "CLINICAL SERVICE",
  "logo": "/bahmni/images/patient-summary.png",
  "link": "/bahmni/clinical/index.html"
}
```

- **`link": "/bahmni/clinical/index.html"`** is the URL used when you click **Clinical Service**.
- After you copy the config (Part 2) and restart **bahmni-web**, the landing page uses this link.

### Step 3.3: Check that Clinical Service works

1. Open **https://localhost** and hard refresh (Ctrl + F5).
2. Click **CLINICAL SERVICE**.
3. You should go to **https://localhost/bahmni/clinical/index.html** and see the clinical app (e.g. patient search or dashboard), not a blank page.

### Step 3.4: If Clinical Service is still blank

**A. Test the URL directly**

In the browser address bar open:

```
https://localhost/bahmni/clinical/index.html
```

- If this page is also blank, the problem is that the **clinical app** is not being served at that path (e.g. proxy or path mismatch).
- If this URL works but the button still gives a blank page, the landing page might still be using old config (see B).

**B. Confirm config was copied**

1. List contents of the config volume (replace volume name):

   ```powershell
   docker run --rm -v bahmni-lite_bahmni-config:/data alpine ls -la /data/openmrs/apps/home/
   ```

   You should see **whiteLabel.json**.

2. Restart again and clear cache:

   ```powershell
   cd "c:\Users\athar\Downloads\bahmni-work\bahmni-work\bahmni-docker\bahmni-lite"
   docker compose --env-file .env restart bahmni-web
   ```

   Then in the browser: hard refresh (Ctrl + F5) or try an incognito/private window.

**C. Check browser console**

1. Press **F12** → open the **Console** tab.
2. Click **Clinical Service** again.
3. Note any **red errors** (e.g. 404, CORS, or JavaScript errors) and fix the path or server config accordingly.

**D. If your app is not under `/bahmni/`**

- Some setups serve the app at **`/`** (e.g. clinical at **`/clinical/index.html`**).
- Then in **whiteLabel.json** change the Clinical Service link to:

  ```json
  "link": "/clinical/index.html"
  ```

- Update the file in **config-sample**, then repeat Part 2 (copy config and restart **bahmni-web**).

---

## Quick reference: commands in order

| Step | Where to run        | Command |
|------|----------------------|--------|
| 1    | Any folder           | `docker volume ls` |
| 2    | openmrs-module-bahmniapps | `docker run --rm -v YOUR_VOLUME_NAME:/data -v "${PWD}/config-sample:/source" alpine sh -c "cp -r /source/openmrs /data/"` |
| 3    | bahmni-docker\bahmni-lite | `docker compose --env-file .env restart bahmni-web` |

Replace **YOUR_VOLUME_NAME** with the name from Step 1 (e.g. `bahmni-lite_bahmni-config`).

---

## File locations (for your changes)

| What | Full path |
|------|-----------|
| Sample config (edit link if needed) | `c:\Users\athar\Downloads\bahmni-work\bahmni-work\openmrs-module-bahmniapps\config-sample\openmrs\apps\home\whiteLabel.json` |
| Bahmni Lite folder (restart commands) | `c:\Users\athar\Downloads\bahmni-work\bahmni-work\bahmni-docker\bahmni-lite` |
| UI app folder (copy command) | `c:\Users\athar\Downloads\bahmni-work\bahmni-work\openmrs-module-bahmniapps` |

---

## Summary

1. **`docker volume ls`** — run in PowerShell from any folder; find the volume that contains `bahmni-config` (e.g. `bahmni-lite_bahmni-config`).
2. **Copy config** — from `openmrs-module-bahmniapps`, run the `docker run ... cp -r ...` command with that volume name.
3. **Restart** — from `bahmni-docker\bahmni-lite`, run `docker compose --env-file .env restart bahmni-web`.
4. **Clinical Service** — is fixed by the sample **whiteLabel.json** setting `"link": "/bahmni/clinical/index.html"` for the Clinical Service card; if your base path is different, change `link` in that file and copy config again.

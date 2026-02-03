# Step-by-Step: Swastik Hospital – Background, Icon, Login Page

**We use Bahmni Lite (not Standard).** Follow these steps **in order** so you see: **(1)** hospital-themed background, **(2)** Swastik Hospital logo, **(3)** login page when you click Clinical Service.

### Today: Lite only – step order

| Order | Step | What you do |
|-------|------|-------------|
| 1 | [Before You Start](#before-you-start-in-detail) | Docker running, `.env` has `BAHMNI_APPS_PATH`, `docker-compose.yml` has landing-page mount |
| 2 | [Step 1](#step-1-hospital-themed-background-landing-page) | Start stack, restart bahmni-web → hospital background |
| 3 | [Step 2](#step-2-swastik-hospital-logo-and-text) | Copy config into volume, restart bahmni-web → logo and “WELCOME TO SWASTIK HOSPITAL” |
| 4 | [Step 3](#step-3-login-page-when-you-click-clinical-service) | Click Clinical Service → login page |

All paths below are for **Lite** unless a section says “Standard”.

---

## After You Shut Down and Reopen Your PC

**Why you don’t see your changes:** After shutdown, Docker containers are stopped. Your **file changes** (e.g. `index.html`, `config-sample`, `whiteLabel.json` in the repo) are still on disk. The **containers** and the **config volume** (logo, welcome text) also stay, but nothing is running until you start Docker again.

**Do this every time after you open your PC:**

1. **Start Docker Desktop**  
   Wait until it says “Docker Desktop is running” (tray icon ready).

2. **Start Bahmni Lite and bahmni-web:**
   ```powershell
   cd "c:\Users\athar\Downloads\bahmni-work\bahmni-work\bahmni-docker\bahmni-lite"
   docker compose --env-file .env up -d
   ```

3. **Restart bahmni-web** so it picks up your repo (landing page, UI):
   ```powershell
   docker compose --env-file .env restart bahmni-web
   ```

4. **If you still don’t see the logo / “WELCOME TO SWASTIK HOSPITAL”:**  
   The config inside the Docker volume may have been lost (e.g. volume recreated). Run **Step 2.2** again (copy config into the volume), then **Step 2.3** (restart bahmni-web), and hard-refresh the page (**Ctrl + F5**).

5. Open **https://localhost** and press **Ctrl + F5** to avoid cache.

**Reports (Run Report) 502 / DNS "reports" fix:** The Reports app needs the `reports` Docker service to be running. In `bahmni-lite\.env` we set `COMPOSE_PROFILES=emr,reports` so that when you run `docker compose up -d`, the reports and reportsdb containers start too. If you used to get "502 Proxy Error" or "DNS lookup failure for: reports" when clicking Run Report, bring the stack down and start again so the reports service starts: `docker compose --env-file .env down` then `docker compose --env-file .env up -d`.

---

## If you use Standard instead of Lite

Use **Bahmni Standard** (OpenELIS, Odoo, etc.) instead of **Bahmni Lite**? Same steps, different folder and volume name.

| What | **Lite** | **Standard** |
|------|----------|--------------|
| **Docker folder** | `bahmni-docker\bahmni-lite` | `bahmni-docker\bahmni-standard` |
| **.env file** | `bahmni-lite\.env` | `bahmni-standard\.env` |
| **docker-compose.yml** | `bahmni-lite\docker-compose.yml` | `bahmni-standard\docker-compose.yml` |
| **Config volume name** | `bahmni-lite_bahmni-config` | `bahmni-standard_bahmni-config` |

**Already done for Standard:** We enabled the same volume mounts in **bahmni-standard** (ui/app, landing page) and set **BAHMNI_APPS_PATH** in `bahmni-standard\.env`. So you can follow the same steps below, but:

- **Replace** every `bahmni-lite` path with **`bahmni-standard`**.
- **Replace** every `bahmni-lite_bahmni-config` with **`bahmni-standard_bahmni-config`** (or use the name from `docker volume ls`).

**Example (Standard):**
```powershell
cd "c:\Users\athar\Downloads\bahmni-work\bahmni-work\bahmni-docker\bahmni-standard"
docker compose --env-file .env up -d
docker compose --env-file .env restart bahmni-web
```

Config copy (Standard):
```powershell
docker run --rm -v bahmni-standard_bahmni-config:/data -v "${PWD}/config-sample:/source" alpine sh -c "cp -r /source/openmrs /data/"
```
(Run from `openmrs-module-bahmniapps`; replace volume name if different from `docker volume ls`.)

---

## Before You Start (in detail)

### 1. Docker Desktop must be running

- **What it is:** The app that runs Docker on Windows (containers, images, volumes).
- **Where to get it:** https://www.docker.com/products/docker-desktop/
- **How to check:** In the system tray (bottom-right), you should see the Docker whale icon. Or open PowerShell and run:
  ```powershell
  docker info
  ```
  If you see version and server info (no error), Docker is running.
- **What to do if not running:** Start **Docker Desktop** from the Start menu and wait until it says “Docker Desktop is running”.

---

### 2. BAHMNI_APPS_PATH must be set in `.env`

- **What it is:** The full path on your PC to the **openmrs-module-bahmniapps** folder (where the Swastik UI and landing page live).
- **Where to change it:**
  - **File (Lite):**  
    `c:\Users\athar\Downloads\bahmni-work\bahmni-work\bahmni-docker\bahmni-lite\.env`
  - **File (Standard):**  
    `c:\Users\athar\Downloads\bahmni-work\bahmni-work\bahmni-docker\bahmni-standard\.env`
  - **Section:** Look for the line under “# Bahmni Web Environment Variables” (around line 79 in lite, 106 in standard).
  - **Exact variable name:** `BAHMNI_APPS_PATH`
- **What to set:**
  - **Current (correct) value:**  
    `BAHMNI_APPS_PATH=c:/Users/athar/Downloads/bahmni-work/bahmni-work/openmrs-module-bahmniapps`
  - Use **forward slashes** (`/`) or escaped backslashes. No space around `=`.
  - If your repo is in a different folder, set it to that folder’s full path (e.g. `BAHMNI_APPS_PATH=D:/projects/openmrs-module-bahmniapps`).
- **Example of the lines in `.env`:**
  ```env
  # Bahmni Web Environment Variables
  BAHMNI_WEB_IMAGE_TAG=1.0.0
  BAHMNI_APPS_PATH=c:/Users/athar/Downloads/bahmni-work/bahmni-work/openmrs-module-bahmniapps
  ```
- **What happens if wrong:** The bahmni-web container won’t find your UI or landing page; you’ll see the default Bahmni page, white background, or 404. After changing `.env`, run:
  ```powershell
  cd "c:\Users\athar\Downloads\bahmni-work\bahmni-work\bahmni-docker\bahmni-lite"
  docker compose --env-file .env up -d
  ```

---

### 3. Volume mount for the landing page in `docker-compose.yml`

- **What it is:** A line that tells Docker to use **your** `index.html` (from the repo) as the landing page instead of the one inside the image.
- **Where it is:**
  - **File (Lite):**  
    `c:\Users\athar\Downloads\bahmni-work\bahmni-work\bahmni-docker\bahmni-lite\docker-compose.yml`
  - **File (Standard):**  
    `c:\Users\athar\Downloads\bahmni-work\bahmni-work\bahmni-docker\bahmni-standard\docker-compose.yml`
  - **Section:** Under the **bahmni-web** service, under **volumes:** (around lines 246–256 in lite, 359–368 in standard).
- **What you should see (the line we added):**
  ```yaml
  bahmni-web:
    image: bahmni/bahmni-web:${BAHMNI_WEB_IMAGE_TAG:?}
    profiles: ["emr","bahmni-lite","bahmni-mart"]
    volumes:
      - "${CONFIG_VOLUME:?}:/usr/local/apache2/htdocs/bahmni_config/:ro"
      - "${BAHMNI_APPS_PATH:?}/ui/app/:/usr/local/apache2/htdocs/bahmni"
      - "${BAHMNI_APPS_PATH:?}/ui/node_modules/@bower_components/:/usr/local/apache2/htdocs/bahmni/components"
      # Swastik: use our landing page (background, logo, Clinical Service link)
      - "${BAHMNI_APPS_PATH:?}/package/docker/index.html:/usr/local/apache2/htdocs/index.html:ro"
  ```
- **What each volume does:**

| Volume line | Meaning |
|-------------|--------|
| `CONFIG_VOLUME` → `bahmni_config/` | Config (e.g. whiteLabel.json) from Docker config volume. |
| `BAHMNI_APPS_PATH/ui/app/` → `htdocs/bahmni` | Your UI (login, clinical, etc.) from the repo. |
| `BAHMNI_APPS_PATH/.../components` → `bahmni/components` | Bower components for the UI. |
| **`BAHMNI_APPS_PATH/package/docker/index.html`** → **`htdocs/index.html`** | **Your landing page** (Swastik background, logo, Clinical Service link). |

- **What to change:**  
  Nothing, unless you moved the repo. The last line uses `BAHMNI_APPS_PATH`, so it automatically uses the path from `.env`.  
  If that line is **missing**, add it under the other `volumes:` of **bahmni-web** (same indentation as the lines above it):
  ```yaml
      - "${BAHMNI_APPS_PATH:?}/package/docker/index.html:/usr/local/apache2/htdocs/index.html:ro"
  ```
- **What happens if the mount is missing:** The root URL (https://localhost) will show the **default** Bahmni landing page (old background, old text). Your changes in `package/docker/index.html` will not appear until this line is present and you restart bahmni-web.

---

## Step 1: Hospital-Themed Background (Landing Page)

The background is in **package/docker/index.html**. The container now uses this file from your repo.

### 1.1 Apply the landing-page mount and restart

From **PowerShell**:

```powershell
cd "c:\Users\athar\Downloads\bahmni-work\bahmni-work\bahmni-docker\bahmni-lite"
docker compose --env-file .env up -d
```

If the stack is already running, restart **bahmni-web** so it picks up the new volume (landing page + ui/app):

```powershell
docker compose --env-file .env restart bahmni-web
```

### 1.2 Open the app and hard-refresh

1. Open **https://localhost** (or http://localhost).
2. Press **Ctrl + F5** (hard refresh) so the browser does not use cache.
3. You should see the **hospital-themed gradient background** (blues and greens), not plain white.

---

## Step 2: Swastik Hospital Logo and Text

Logo and “WELCOME TO SWASTIK HOSPITAL” come from:

- **Landing page:** `package/docker/index.html` (already mounted in Step 1).
- **Config:** `whiteLabel.json` in the Docker **config volume**. You must copy the sample config into that volume.

### 2.1 Find your config volume name (do this first)

**Process:**

1. Open **PowerShell**.
2. Run:
   ```powershell
   docker volume ls
   ```
3. In the list, find the volume that holds Bahmni config. For **Lite** it is often **`bahmni-lite_bahmni-config`** (or **`bahmni-config`** if your project has no prefix).
4. **Copy that exact name** (e.g. `bahmni-lite_bahmni-config`). You will use it in Step 2.2.

**Example output:**
```
DRIVER    VOLUME NAME
local     bahmni-lite_bahmni-config
local     bahmni-lite_openmrs-uploads
...
```
→ Use **`bahmni-lite_bahmni-config`** in the copy command in Step 2.2.

### 2.2 Copy Swastik config into the config volume

**Important:** The `config-sample` folder is inside **openmrs-module-bahmniapps**, not inside bahmni-lite or bahmni-standard. So either **(A)** run from that folder, or **(B)** use the full path to config-sample.

**Option A – Run from openmrs-module-bahmniapps (recommended)**

1. Run:
   ```powershell
   cd "c:\Users\athar\Downloads\bahmni-work\bahmni-work\openmrs-module-bahmniapps"
   ```
2. Run the copy command. **Replace `YOUR_VOLUME_NAME`** with the name from Step 2.1 (e.g. `bahmni-lite_bahmni-config`):
   ```powershell
   docker run --rm -v YOUR_VOLUME_NAME:/data -v "${PWD}/config-sample:/source" alpine sh -c "cp -r /source/openmrs /data/"
   ```
   **Lite example** (if your volume is `bahmni-lite_bahmni-config`):
   ```powershell
   docker run --rm -v bahmni-lite_bahmni-config:/data -v "${PWD}/config-sample:/source" alpine sh -c "cp -r /source/openmrs /data/"
   ```
   **Standard example** (if your volume is `bahmni-standard_bahmni-config`):
   ```powershell
   docker run --rm -v bahmni-standard_bahmni-config:/data -v "${PWD}/config-sample:/source" alpine sh -c "cp -r /source/openmrs /data/"
   ```

**Option B – Run from any folder (use full path to config-sample)**

Replace **`YOUR_VOLUME_NAME`** with the name from Step 2.1:

**Lite:**
```powershell
docker run --rm -v YOUR_VOLUME_NAME:/data -v "c:/Users/athar/Downloads/bahmni-work/bahmni-work/openmrs-module-bahmniapps/config-sample:/source" alpine sh -c "cp -r /source/openmrs /data/"
```

**Standard:**
```powershell
docker run --rm -v YOUR_VOLUME_NAME:/data -v "c:/Users/athar/Downloads/bahmni-work/bahmni-work/openmrs-module-bahmniapps/config-sample:/source" alpine sh -c "cp -r /source/openmrs /data/"
```

If you see **`Error: No such volume`**, the volume name is wrong. Run `docker volume ls` again and use the **exact** name from the list.

### 2.3 Restart bahmni-web and refresh

Run **each command on its own line** (no extra text after `bahmni-web`):

**Lite:**
```powershell
cd "c:\Users\athar\Downloads\bahmni-work\bahmni-work\bahmni-docker\bahmni-lite"
docker compose --env-file .env restart bahmni-web
```

**Standard:**
```powershell
cd "c:\Users\athar\Downloads\bahmni-work\bahmni-work\bahmni-docker\bahmni-standard"
docker compose --env-file .env restart bahmni-web
```

Then open **https://localhost** and press **Ctrl + F5**. You should see:

- **Swastik Hospital** logo at the top.
- **“WELCOME TO SWASTIK HOSPITAL”** (from config).
- **Clinical Service** card with an icon (and two other cards with icons).

---

## Step 3: Login Page When You Click “Clinical Service”

The **login page** is the **home app** at `/bahmni/home/index.html#/login`. It already exists in your repo under **ui/app/home/**.

### 3.1 Make sure Clinical Service points to the login page

The **config-sample** we copy in Step 2 already sets this in **whiteLabel.json**:

- **Clinical Service** → `"link": "/bahmni/home/index.html#/login"`

So after you complete **Step 2**, clicking **Clinical Service** should open the **login page**.

### 3.2 If Clinical Service does not open the login page

1. Confirm you ran **Step 2.2** (copy config into the volume) and **Step 2.3** (restart bahmni-web).
2. Hard-refresh the landing page (**Ctrl + F5**).
3. Click **Clinical Service** again. It should go to the login screen (username/password, locale).

### 3.3 Open the login page directly (to check it exists)

In the browser, go to:

**https://localhost/bahmni/home/index.html#/login**

You should see the **Swastik Hospital** login page: logo, “SWASTIK HOSPITAL LOGIN” header, “SWASTIK HOSPITAL” title, username/password form, and locale selector. The login page uses Swastik branding (logo and text from config and locale); the **landing page (home)** is unchanged and already has Swastik branding.

**If the login page is blank (white screen at https://localhost/bahmni/home/index.html#/login):**

1. **Install UI dependencies** – The login page needs Angular and other scripts from `/bahmni/components/`, which come from `ui/node_modules/@bower_components/`. If that folder is missing, scripts 404 and the page stays blank. In **PowerShell** run:
   ```powershell
   cd "c:\Users\athar\Downloads\bahmni-work\bahmni-work\openmrs-module-bahmniapps\ui"
   npm install --legacy-peer-deps
   ```
   (Use `--legacy-peer-deps` if you see a dependency conflict error; otherwise plain `npm install` is enough.) Wait until it finishes (it may take a few minutes).

2. **Restart bahmni-web** so it serves the new `node_modules/@bower_components`:
   ```powershell
   cd "c:\Users\athar\Downloads\bahmni-work\bahmni-work\bahmni-docker\bahmni-lite"
   docker compose --env-file .env restart bahmni-web
   ```

3. Open **https://localhost/bahmni/home/index.html#/login** and press **Ctrl + F5**. You should see the Swastik Hospital login page (logo, username/password, locale).

**If the login page loads but layout looks wrong (logos too big, form not centered):**  
The app uses a plain-CSS override file so you don’t need to run Grunt/Compass. Make sure **Ctrl + F5** (hard refresh) so the browser loads `home-login-overrides.css`. If you still see the old layout, in Developer Tools (F12) → Network tab, reload and check that `home-login-overrides.css` returns 200 (not 404).

If you still see a blank page, open the browser **Developer Tools** (F12) → **Console** tab and check for red errors (e.g. 404 for a script). That will show which file is missing.

---

## Replacing Bahmni with Swastik (location and home)

**Goal:** Show “Swastik Hospital” instead of “Bahmni” in the UI (location dropdown, home link, etc.).

**Already done in locale (English):**
- **Location dropdown:** The locale file maps “Bahmni Clinic” and “Bahmni” to “Swastik Hospital”, so the location selection page shows “Swastik Hospital” instead of “Bahmni Clinic”.
- **Home link:** The clinical app home link text is set to “Swastik Hospital Home” instead of “Bahmni Home”.

**To change the actual location name in OpenMRS (optional):**  
If you want the stored location name to be “Swastik Hospital” (e.g. in reports or admin), use OpenMRS Admin → **Manage Locations** → edit the location that is tagged “Login Location” and change its name from “Bahmni Clinic” to “Swastik Hospital”. The UI will still use the locale translation if the name in the database stays “Bahmni Clinic”.

---

## Quick Checklist

| Step | What you did | What you see |
|------|----------------|---------------|
| 1    | Restart bahmni-web, Ctrl+F5 on https://localhost | Hospital gradient background (no plain white) |
| 2    | Copy config-sample into config volume, restart bahmni-web, Ctrl+F5 | Swastik logo, “WELCOME TO SWASTIK HOSPITAL”, icons on all three cards |
| 3    | Click “Clinical Service” on landing page | Login page at /bahmni/home/index.html#/login |

---

## If You Still Don’t See Changes

1. **`cp: can't stat '/source/openmrs': No such file or directory`**  
   You ran the config copy from the wrong folder. **config-sample** is inside **openmrs-module-bahmniapps**, not inside bahmni-lite or bahmni-standard. Run the `docker run` command **from** `openmrs-module-bahmniapps` (Option A in Step 2.2), or use the **full path** to config-sample (Option B).

2. **`no such service: bahmni-webcd`** (or similar)  
   Typo: the service name is **`bahmni-web`** only. Run:  
   `docker compose --env-file .env restart bahmni-web`  
   (Nothing after `bahmni-web`.)

3. **`TLS handshake timeout` or `failed to copy` when pulling images**  
   Network/Docker Hub timeout. Wait a bit and run `docker compose --env-file .env up -d` again. If it keeps failing, check your internet connection, VPN, or corporate proxy.

4. **Landing page still old (white background, old text)**  
   - Confirm in **docker-compose.yml** (bahmni-web volumes) there is a line like:  
     `- "${BAHMNI_APPS_PATH:?}/package/docker/index.html:/usr/local/apache2/htdocs/index.html:ro"`  
   - Restart: `docker compose --env-file .env restart bahmni-web`  
   - Hard-refresh: **Ctrl + F5**.

5. **Config (logo, welcome text, Clinical link) not updating**  
   - Copy config again (Step 2.2) with the **correct volume name** from `docker volume ls`.  
   - Restart bahmni-web and hard-refresh.

6. **Clinical Service has no icon / image missing**  
   - **Reason 1:** The config file in the Docker volume was not loaded (e.g. copy failed or wrong volume). Then the cards (including Clinical Service) were never drawn. **Fix:** Copy config again (Step 2.2) from **openmrs-module-bahmniapps**, then restart bahmni-web and hard-refresh. The landing page now also shows default cards if config fails to load.  
   - **Reason 2:** The **/bahmni/** path is not served, so `/bahmni/images/patient-summary.png` returns 404. **Fix:** Ensure **BAHMNI_APPS_PATH** in `.env` points to **openmrs-module-bahmniapps** and that bahmni-web has the volume `"${BAHMNI_APPS_PATH:?}/ui/app/:/usr/local/apache2/htdocs/bahmni"`. Restart bahmni-web.  
   - Config uses `patient-summary.png`; if it fails to load, the page falls back to `app.png`. Both are under **ui/app/images/**.

7. **Login page blank or 404**  
   - Check **BAHMNI_APPS_PATH** in `.env` (e.g. `c:/Users/athar/Downloads/bahmni-work/bahmni-work/openmrs-module-bahmniapps`).  
   - Ensure bahmni-web has the volume:  
     `"${BAHMNI_APPS_PATH:?}/ui/app/:/usr/local/apache2/htdocs/bahmni"`  
   - Restart bahmni-web and try: https://localhost/bahmni/home/index.html#/login

---

## Summary of What We Changed in the Repo

- **package/docker/index.html** – Hospital gradient background, Swastik branding, Clinical Service icon fallback, link logic.
- **docker-compose.yml** (bahmni-web) – Extra volume so the **landing page** is served from your repo:  
  `package/docker/index.html` → `/usr/local/apache2/htdocs/index.html`
- **config-sample/openmrs/apps/home/whiteLabel.json** – “WELCOME TO SWASTIK HOSPITAL”, Swastik logo paths, Clinical Service link to login page.
- **ui/app/home/** – Contains the login app; **ui/app/images/** has **swastikLogo.png** and **swastikLogoFull.png**.

No image rebuild is required: the running container uses your files via the volume mounts.

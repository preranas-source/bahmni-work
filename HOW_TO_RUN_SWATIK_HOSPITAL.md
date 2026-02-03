# How to Run Swastik Hospital (Bahmni)

Use one of the options below. **Option 1** is the simplest: run the full app with Docker. **Option 2** is to run with your Swastik-branded UI (your logo and text) using Docker hot-deploy.

---

## Prerequisites

- **Docker Desktop for Windows**  
  Install from: https://www.docker.com/products/docker-desktop/  
  Start Docker Desktop before running any Docker commands.

- **(Optional, for Option 2)**  
  So the UI is served from your code (Swastik branding): set `BAHMNI_APPS_PATH` and use the volume mount as below.

---

## Option 1: Run the full app with Docker (quickest)

This starts Bahmni using pre-built images. The UI will be the default one until you do Option 2.

### 1. Open PowerShell

### 2. Go to the Bahmni Lite folder

```powershell
cd "c:\Users\athar\Downloads\bahmni-work\bahmni-work\bahmni-docker\bahmni-lite"
```

### 3. Start all services

```powershell
docker compose --env-file .env up -d
```

Wait until all containers are up (first time may take several minutes to pull images).

### 4. Open the app in your browser

- **URL:** http://localhost  
- Default login is often **superman** / **Admin123** (check your `bahmni_config` or Docker docs if different).

### 5. Stop the app when done

```powershell
cd "c:\Users\athar\Downloads\bahmni-work\bahmni-work\bahmni-docker\bahmni-lite"
docker compose --env-file .env --profile emr --profile bahmni-lite --profile bahmni-standard --profile bahmni-mart down
```

---

## Option 2: Run with your Swastik Hospital UI (your logo and text)

So the login page and footer show **your** Swastik logos and text from your code.

### 1. Use Option 1 first

Make sure Docker and Bahmni run correctly with the commands in Option 1.

### 2. Set your UI code path in `.env`

Open:

`c:\Users\athar\Downloads\bahmni-work\bahmni-work\bahmni-docker\bahmni-lite\.env`

Find the line:

```env
BAHMNI_APPS_PATH=
```

Change it to the full path of `openmrs-module-bahmniapps` (use forward slashes or escaped backslashes), for example:

```env
BAHMNI_APPS_PATH=c:/Users/athar/Downloads/bahmni-work/bahmni-work/openmrs-module-bahmniapps
```

Save the file.

### 3. Enable hot-deploy in Docker Compose

Open:

`c:\Users\athar\Downloads\bahmni-work\bahmni-work\bahmni-docker\bahmni-lite\docker-compose.yml`

Find the `bahmni-web` service (around line 246). Under `volumes:` you should see something like:

```yaml
volumes:
  - "${CONFIG_VOLUME:?}:/usr/local/apache2/htdocs/bahmni_config/:ro"
#   - "${BAHMNI_APPS_PATH:?}/ui/app/:/usr/local/apache2/htdocs/bahmni"
#   - "${BAHMNI_APPS_PATH:?}/ui/node_modules/@bower_components/:/usr/local/apache2/htdocs/bahmni/components"
```

Uncomment the two lines that start with `#` (remove the `#` and the space after it), so it becomes:

```yaml
volumes:
  - "${CONFIG_VOLUME:?}:/usr/local/apache2/htdocs/bahmni_config/:ro"
  - "${BAHMNI_APPS_PATH:?}/ui/app/:/usr/local/apache2/htdocs/bahmni"
  - "${BAHMNI_APPS_PATH:?}/ui/node_modules/@bower_components/:/usr/local/apache2/htdocs/bahmni/components"
```

Save the file.

### 4. Restart with the new config

```powershell
cd "c:\Users\athar\Downloads\bahmni-work\bahmni-work\bahmni-docker\bahmni-lite"
docker compose --env-file .env down
docker compose --env-file .env up -d
```

### 5. Open the app

- **URL:** http://localhost  
- You should see your Swastik Hospital logo and text (from `ui/app/images/` and your locale/HTML changes).

---

## Remove "Bahmni" from the landing page and fix Clinical Service

The **landing page** (with "WELCOME TO...", Clinical Service, Payment & Billing, Analytics) is controlled by:

1. **Default HTML** – We already updated `openmrs-module-bahmniapps/package/docker/index.html` so the default title is "Swastik Hospital", default welcome text is "WELCOME TO SWASTIK HOSPITAL", and the footer says "Swastik Hospital Help". Those changes apply when you **build your own bahmni-web image** from this repo. If you use the pre-built Docker image, the container may still show the old text until config overrides it.

2. **Config (whiteLabel.json)** – The landing page loads `/bahmni_config/openmrs/apps/home/whiteLabel.json`. If that file has `homePage.header_text` and `landingPage` with the right links, it overrides the defaults and fixes the **Clinical Service** link.

**To apply Swastik branding and fix Clinical Service:**

- Copy the sample config into your bahmni_config volume so the landing page gets "WELCOME TO SWASTIK HOSPITAL" and the Clinical Service link points to the login page.
- Full steps: see **openmrs-module-bahmniapps/config-sample/README.md**.

**Summary:** From the `openmrs-module-bahmniapps` folder, run (use your actual config volume name from `docker volume ls`):

```powershell
docker run --rm -v bahmni-lite_bahmni-config:/data -v "${PWD}/config-sample:/source" alpine sh -c "cp -r /source/openmrs /data/"
docker compose --env-file .env restart bahmni-web
```

Then hard-refresh the landing page (Ctrl+F5). Clinical Service should open the clinical app instead of a blank page.

---

## Useful Docker commands (PowerShell)

Run these from `bahmni-docker\bahmni-lite`:

| What you want           | Command |
|-------------------------|--------|
| Start the app           | `docker compose --env-file .env up -d` |
| Stop the app            | `docker compose --env-file .env --profile emr --profile bahmni-lite --profile bahmni-standard --profile bahmni-mart down` |
| See running services    | `docker compose --env-file .env ps` |
| OpenMRS logs             | `docker compose --env-file .env logs openmrs -f` |
| Pull latest images       | `docker compose --env-file .env pull` |

---

## If you prefer the run script (Git Bash or WSL)

If you have **Git Bash** or **WSL** installed:

```bash
cd /c/Users/athar/Downloads/bahmni-work/bahmni-work/bahmni-docker/bahmni-lite
bash run-bahmni.sh
```

Then choose option **1** to START. Use option **2** to STOP.

---

## Troubleshooting

- **Port 80 already in use**  
  Stop other apps using port 80, or change the proxy port in `docker-compose.yml` (e.g. `'8080:80'`) and open http://localhost:8080.

- **Docker not found**  
  Install Docker Desktop and ensure it is running.

- **Swastik logo not showing**  
  Confirm `swastikLogo.png` and `swastikLogoFull.png` exist in `openmrs-module-bahmniapps\ui\app\images\` and that you used Option 2 with the correct `BAHMNI_APPS_PATH` and volume mount.

- **UI / landing page changes not showing in browser**  
  1. Restart the web container so it serves the latest files:  
     `docker compose --env-file .env restart bahmni-web`  
  2. Hard-refresh the page: **Ctrl+Shift+R** (or **Ctrl+F5**).  
  3. If the landing page still shows "Bahmni EMR", the code now forces "SWASTIK HOSPITAL" when config contains "Bahmni EMR" – reload once after the restart.

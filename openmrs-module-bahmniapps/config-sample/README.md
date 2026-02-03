# Swastik Hospital – Config sample

Use this so the **landing page** shows “Swastik Hospital” and the **Clinical Service** link works.

## What this does

- **whiteLabel.json** sets:
  - Welcome text: “WELCOME TO SWASTIK HOSPITAL”
  - Logo and help link for Swastik Hospital
  - **Clinical Service** link to `/bahmni/home/index.html#/login` (so it opens the login page)

## How to use with Docker

The landing page loads config from the **bahmni_config** volume. Copy the sample into that volume.

### Option A: Copy into the running config volume

**Important:** The command must see the **config-sample** folder. Either run it **from** the `openmrs-module-bahmniapps` folder (where config-sample lives), or use the **full path** to config-sample.

**From openmrs-module-bahmniapps (recommended):**
```powershell
cd "c:\Users\athar\Downloads\bahmni-work\bahmni-work\openmrs-module-bahmniapps"
docker run --rm -v bahmni-lite_bahmni-config:/data -v "${PWD}/config-sample:/source" alpine sh -c "cp -r /source/openmrs /data/"
```

**From any folder (use full path to config-sample):**
```powershell
docker run --rm -v bahmni-lite_bahmni-config:/data -v "c:/Users/athar/Downloads/bahmni-work/bahmni-work/openmrs-module-bahmniapps/config-sample:/source" alpine sh -c "cp -r /source/openmrs /data/"
```

If your config volume has a different name, use it instead of `bahmni-lite_bahmni-config`. To see volume names: `docker volume ls`

Then restart the web container so it picks up the new config:

```powershell
cd "c:\Users\athar\Downloads\bahmni-work\bahmni-work\bahmni-docker\bahmni-lite"
docker compose --env-file .env restart bahmni-web
```

### Option B: Use a host folder as config

1. Copy `config-sample` to a folder on your machine (e.g. `C:\bahmni-config`).
2. In `bahmni-docker\bahmni-lite\.env`, set:
   ```env
   CONFIG_VOLUME=C:/bahmni-config
   ```
   (Use the path to the folder that contains the `openmrs` folder from config-sample.)
3. Restart:
   ```powershell
   docker compose --env-file .env down
   docker compose --env-file .env up -d
   ```

## After updating config

1. Hard-refresh the landing page (Ctrl+F5) or clear cache.
2. You should see “WELCOME TO SWASTIK HOSPITAL” and “Swastik Hospital” branding.
3. **Clinical Service** should open the login page at `/bahmni/home/index.html#/login`.

If Clinical Service is still blank, check the browser console (F12) for errors and confirm the app is available at that URL.

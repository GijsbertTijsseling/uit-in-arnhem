#!/usr/bin/env bash
set -e

# ==============================================================================
# Google Cloud Run Job & Cloud Scheduler Deployment Script
# Uit in Arnhem - Agenda Scraper
# Prefix: uitinarnhem-
# ==============================================================================

PROJECT_ID=${GCP_PROJECT_ID:-"pixel55-projecten"}
REGION=${GCP_REGION:-"europe-west4"} # Eemshaven, Nederland
REPO_NAME="uitinarnhem-docker-repo"
JOB_NAME="uitinarnhem-agenda-scraper"
SCHEDULER_JOB_NAME="uitinarnhem-agenda-scraper-cron"
SCHEDULE=${CRON_SCHEDULE:-"0 3 1,15 * *"} # 1e en 15e van de maand om 03:00 uur (Amsterdam tijd)
TIMEZONE="Europe/Amsterdam"

IMAGE_TAG="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${JOB_NAME}:latest"

RUNNER_SA="uitinarnhem-scraper-runner@${PROJECT_ID}.iam.gserviceaccount.com"
INVOKER_SA="uitinarnhem-scraper-invoker@${PROJECT_ID}.iam.gserviceaccount.com"

echo "=========================================================="
echo " Deploying Agenda Scraper to Google Cloud Run (Jobs)"
echo " Project:   ${PROJECT_ID}"
echo " Region:    ${REGION}"
echo " Job Name:  ${JOB_NAME}"
echo " Schedule:  ${SCHEDULE} (${TIMEZONE})"
echo " Image:     ${IMAGE_TAG}"
echo "=========================================================="

# 1. Ensure Artifact Registry repository exists
echo "[1/4] Checking Artifact Registry repository..."
gcloud artifacts repositories describe "${REPO_NAME}" \
  --project="${PROJECT_ID}" \
  --location="${REGION}" >/dev/null 2>&1 || \
gcloud artifacts repositories create "${REPO_NAME}" \
  --repository-format=docker \
  --location="${REGION}" \
  --description="Docker repository for Uit in Arnhem scraper containers" \
  --project="${PROJECT_ID}"

# 2. Build and push container image using Cloud Build
echo "[2/4] Building and pushing container image via Cloud Build..."
gcloud builds submit --project="${PROJECT_ID}" --tag="${IMAGE_TAG}" ./scraper

# 3. Deploy or update Cloud Run Job
echo "[3/4] Deploying Cloud Run Job..."
gcloud run jobs deploy "${JOB_NAME}" \
  --project="${PROJECT_ID}" \
  --region="${REGION}" \
  --image="${IMAGE_TAG}" \
  --tasks=1 \
  --max-retries=1 \
  --task-timeout=300s \
  --service-account="${RUNNER_SA}" \
  --set-env-vars=TZ="${TIMEZONE}" \
  --set-secrets="DATABASE_URL=uitinarnhem-database-url:latest,SUPABASE_URL=uitinarnhem-supabase-url:latest"

# 4. Deploy or update Cloud Scheduler Job
echo "[4/4] Configuring Cloud Scheduler..."
SCHEDULER_URI="https://${REGION}-run.googleapis.com/v2/projects/${PROJECT_ID}/locations/${REGION}/jobs/${JOB_NAME}:run"

if gcloud scheduler jobs describe "${SCHEDULER_JOB_NAME}" --project="${PROJECT_ID}" --location="${REGION}" >/dev/null 2>&1; then
  echo "Updating existing Cloud Scheduler job..."
  gcloud scheduler jobs update http "${SCHEDULER_JOB_NAME}" \
    --project="${PROJECT_ID}" \
    --location="${REGION}" \
    --schedule="${SCHEDULE}" \
    --time-zone="${TIMEZONE}" \
    --uri="${SCHEDULER_URI}" \
    --http-method=POST \
    --oauth-service-account-email="${INVOKER_SA}" \
    --oauth-token-scope="https://www.googleapis.com/auth/cloud-platform"
else
  echo "Creating new Cloud Scheduler job..."
  gcloud scheduler jobs create http "${SCHEDULER_JOB_NAME}" \
    --project="${PROJECT_ID}" \
    --location="${REGION}" \
    --schedule="${SCHEDULE}" \
    --time-zone="${TIMEZONE}" \
    --uri="${SCHEDULER_URI}" \
    --http-method=POST \
    --oauth-service-account-email="${INVOKER_SA}" \
    --oauth-token-scope="https://www.googleapis.com/auth/cloud-platform"
fi

echo "=========================================================="
echo " Deployment Voltooid!"
echo " Handmatig starten: gcloud run jobs execute ${JOB_NAME} --region=${REGION} --project=${PROJECT_ID}"
echo "=========================================================="

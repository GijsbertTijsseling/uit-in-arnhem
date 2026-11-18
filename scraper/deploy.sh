#!/usr/bin/env bash
set -e

# ==============================================================================
# Google Cloud Run Job & Cloud Scheduler Deployment Script
# Uit in Arnhem - Agenda Scraper
# ==============================================================================

# 1. Configuration (adjust these to your GCP project)
PROJECT_ID=${GCP_PROJECT_ID:-"uit-in-arnhem"}
REGION=${GCP_REGION:-"europe-west4"} # Eemshaven, Netherlands
JOB_NAME="agenda-scraper"
SCHEDULER_JOB_NAME="agenda-scraper-cron"
SCHEDULE=${CRON_SCHEDULE:-"0 3 1,15 *"} # 1st and 15th of each month at 03:00 Amsterdam time
TIMEZONE="Europe/Amsterdam"
IMAGE_TAG="gcr.io/${PROJECT_ID}/${JOB_NAME}:latest"

INVOKER_SA="agenda-scraper-invoker@${PROJECT_ID}.iam.gserviceaccount.com"
RUNNER_SA="agenda-scraper-runner@${PROJECT_ID}.iam.gserviceaccount.com"

echo "=== Deploying Agenda Scraper to Google Cloud Run (Jobs) ==="
echo "Project:   ${PROJECT_ID}"
echo "Region:    ${REGION}"
echo "Job Name:  ${JOB_NAME}"
echo "Schedule:  ${SCHEDULE} (${TIMEZONE})"
echo "=========================================================="

# 2. Build and push container image using Cloud Build
echo "Building and pushing container image..."
gcloud builds submit --project="${PROJECT_ID}" --tag="${IMAGE_TAG}" ./scraper

# 3. Create or update Cloud Run Job
echo "Configuring Cloud Run Job..."
gcloud run jobs deploy "${JOB_NAME}" \
  --project="${PROJECT_ID}" \
  --region="${REGION}" \
  --image="${IMAGE_TAG}" \
  --tasks=1 \
  --max-retries=1 \
  --task-timeout=300s \
  --service-account="${RUNNER_SA}" \
  --set-env-vars=TZ="${TIMEZONE}" \
  --set-secrets=SUPABASE_URL=projects/${PROJECT_ID}/secrets/supabase-url:latest,SUPABASE_SERVICE_ROLE_KEY=projects/${PROJECT_ID}/secrets/supabase-service-role-key:latest

# 4. Create or update Cloud Scheduler Job
echo "Configuring Cloud Scheduler..."
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

echo "=== Deployment Finished Successfully ==="
echo "To test run manually in Cloud Run: gcloud run jobs execute ${JOB_NAME} --region=${REGION} --project=${PROJECT_ID}"


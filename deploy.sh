export $(grep -v '^#' .env | xargs -d '\n')
export AWS_PROFILE=my-profile

aws configure set aws_access_key_id $(echo ${AWS_ACCESS_KEY//\"})
aws configure set aws_secret_access_key $(echo ${AWS_SECRET_KEY//\"})
aws configure set region $(echo ${AWS_REGION//\"})
aws configure set output json
aws sts get-caller-identity

docker compose -f *prod* build
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 952002773581.dkr.ecr.ap-southeast-1.amazonaws.com
docker compose -f *prod* push

# aws apprunner start-deployment --service=${APP_RUNNER_SERVICE_ARN//\"}
docker logout

echo "Done"
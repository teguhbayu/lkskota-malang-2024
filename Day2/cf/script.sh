#!/bin/bash
sudo -u ec2-user -i <<'EOF'
sudo yum update -y
curl -fsSL https://rpm.nodesource.com/setup_21.x | sudo bash -
sudo yum install -y nodejs git
sudo npm install pm2 -g
aws configure set aws_access_key_id "ASIAZQ3DOEAZPDTXX74S"
aws configure set aws_secret_access_key "16dc/dkxU8SB3/FVICxUqYjzO9d3sr5eW1CPDuOP"
aws configure set region "us-east-1"
aws configure set aws_session_token "FwoGZXIvYXdzEH8aDNUMaNrQCEfweED3JSLXAR7fvbA26uBsm0PC/X5foywSPBZHdUJxsWmSnbmscuIz5whbgB+M6YcadORoG2RT3unn99Ww6wcPWG376xJrT4yxiHKiZHlYf4IQRCpRsdoTGBJAUBkghEuopyOWyiahRQgRIQeVGyK2xMaxsUlQZgJ0zp3/HLOEjcAjZU9iDCn7XdssTlgWcsDln3JmY4VtbIfNYFooi7KDnG9eOr6VtkV93rXexfWX9+JKMMCvQ6bz5d9udI44FuF5UloaCfsUKTk2XDrvBM6w2neW5R8PEGb48JU6s6LKKOLD264GMi3XDJUr6x2I0ihrYHpFvHbr4HziiCLU0MdOqv6R6hCPfOx/Dbauy/YQU+HMiY0="
aws sns publish --topic-arn "${arn}" --message "Teguh Bayu Pratama - lksapps1a created"
git clone https://github.com/handipradana/dash.git /home/ec2-user/dash
cd /home/ec2-user/dash
npm i
echo 'AWS_ACCESS_KEY="ASIAZQ3DOEAZPDTXX74S"' > .env
echo 'AWS_SECRET_ACCESS_KEY="16dc/dkxU8SB3/FVICxUqYjzO9d3sr5eW1CPDuOP"' >> .env
echo 'AWS_SESSION_TOKEN="FwoGZXIvYXdzEH8aDNUMaNrQCEfweED3JSLXAR7fvbA26uBsm0PC/X5foywSPBZHdUJxsWmSnbmscuIz5whbgB+M6YcadORoG2RT3unn99Ww6wcPWG376xJrT4yxiHKiZHlYf4IQRCpRsdoTGBJAUBkghEuopyOWyiahRQgRIQeVGyK2xMaxsUlQZgJ0zp3/HLOEjcAjZU9iDCn7XdssTlgWcsDln3JmY4VtbIfNYFooi7KDnG9eOr6VtkV93rXexfWX9+JKMMCvQ6bz5d9udI44FuF5UloaCfsUKTk2XDrvBM6w2neW5R8PEGb48JU6s6LKKOLD264GMi3XDJUr6x2I0ihrYHpFvHbr4HziiCLU0MdOqv6R6hCPfOx/Dbauy/YQU+HMiY0="' >> .env
pm2 start /home/ec2-user/dash/apps.js
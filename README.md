# Fixer Dependencies
1. download node v18+
2. download terraform
3. download aws cli

# aws
1. credentials at: `~/.aws/credentials` on aws cli in the learner lab
2. run `aws configure` and insert the keys
Note: you need to insert manually the aws_session_token by going LOCALLY (wsl) to: `~/.aws`
and run: `vi credentials` andd your token and type `wq`
After that you can use the aws cli for your purpose

# trraform
1. run: terraform apply
2. copy the server_dev public key to .ssh: cp fixer_server_dev_key_file ~/.ssh
3. copy the frontend public key to .ssh: cp fixer_frontend_key_file ~/.ssh
4. lock the files: sudo chmod 500 fixer_frontend_key_file
5. ssh to an instance using WSL:
    * cd ~/.ssh
    * ssh -i fixer_server_dev_key_file_omer ubuntu@50.16.119.241
    * ssh -i fixer_frontend_key_file_omer ubuntu@18.235.57.109

# EC2
1. to add Nodejs:
    * sudo su
    * sudo apt update
    * curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
    * . ~/.nvm/nvm.sh
    * nvm install --lts
2. to clone the project: git clone https://github.com/razielron/Fixer.git
3. to run the server:
    * cd Fixer/server
    * add .env.prod file
    * add .env file for Prisma
    * npm i
    * export NODE_ENV=prod
    * npx prisma generate
    * npm run migrate-dev
    * npm run build
    * npm run start
4. to run the frontend:
    * cd Fixer
    * cd client/fixer-app
    * add .env.prod file
    * npm i
    * npm run build
    * sudo su
    * export NODE_ENV=prod
    * npm run build
    * npm run start

# RDS
1. conenct from ec2:
    * you might need to install mysql: apt install mysql-client-core-8.0
    * connect: mysql -h terraform-20230525121928139400000004.cbsddfyptf6p.us-east-1.rds.amazonaws.com -P 3306 -u admin -p
2. common queries:
    * select * from test.User

# Cognito
1. https://brianmorrison.me/blog/adding-authentication-to-a-nodejs-api-using-aws-cognito/
2. https://dev.to/aws-builders/how-to-use-amazon-cognito-with-reacttypescript-4elj
3. https://awstip.com/using-aws-cognito-with-vue-nuxt-auth-a82ec5653e71?gi=000f15d63fbc
4. https://medium.com/@tmorales/create-a-custom-ui-authentication-flow-with-aws-cognito-and-react-from-scratch-40285e22cf19
5. https://medium.com/@dantasfiles/three-methods-to-get-user-information-in-aws-amplify-authentication-e4e39e658c33
6. IMPORTANT!!!! https://stackoverflow.com/questions/54439440/does-aws-cognito-remove-the-need-for-a-users-table-in-my-database

# Pipeline
1. https://www.youtube.com/watch?v=8jml8Ni5cIE&ab_channel=CloudGuru
2. https://docs.aws.amazon.com/codepipeline/latest/userguide/concepts-devops-example.html

# Docker file
1. https://docs.docker.com/engine/reference/builder/
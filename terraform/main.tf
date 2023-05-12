# Provider Block
provider "aws" {
    profile = "default"
    region = "us-east-1"
}
########################################################################

# Variable blocks
variable "public_subnet_cidrs" {
 type        = list(string)
 description = "Public Subnet CIDR values"
 default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}
 
variable "private_subnet_cidrs" {
 type        = list(string)
 description = "Private Subnet CIDR values"
 default     = ["10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24"]
}

variable "db_username" {
    default = "admin"
}

variable "db_password" {
    default = "osr123456"
}
########################################################################

# VPC blocks
resource "aws_vpc" "fixer_vpc" {
    cidr_block = "10.0.0.0/16"

    tags = {
        Name = "fixer_vpc"
    }
}

resource "aws_subnet" "public_subnets" {
    count      = length(var.public_subnet_cidrs)
    vpc_id     = aws_vpc.fixer_vpc.id
    cidr_block = element(var.public_subnet_cidrs, count.index)

    tags = {
        Name = "Public Subnet ${count.index + 1}"
    }
}
 
resource "aws_subnet" "private_subnets" {
    count      = length(var.private_subnet_cidrs)
    vpc_id     = aws_vpc.fixer_vpc.id
    cidr_block = element(var.private_subnet_cidrs, count.index)

    tags = {
        Name = "Private Subnet ${count.index + 1}"
    }
}

resource "aws_subnet" "rds_subnet2" {
  cidr_block        = "10.0.7.0/24"
  vpc_id            = aws_vpc.fixer_vpc.id
  availability_zone = "us-east-1b"
}
########################################################################

# Security group block
resource "aws_security_group" "fixer_server_dev_sg" {
    name        = "fixer_server_dev_sg"
    description = "Allow TLS inbound traffic"
    vpc_id      = aws_vpc.fixer_vpc.id

    ingress {
        from_port        = 5000
        to_port          = 5000
        protocol         = "tcp"
        cidr_blocks      = ["0.0.0.0/0"]
    }

    ingress {
        from_port        = 22
        to_port          = 22
        protocol         = "tcp"
        cidr_blocks      = ["0.0.0.0/0"]
    }

    ingress {
        from_port        = 80
        to_port          = 80
        protocol         = "tcp"
        cidr_blocks      = ["0.0.0.0/0"]
    }

    ingress {
        description      = "TLS from VPC"
        from_port        = 443
        to_port          = 443
        protocol         = "tcp"
        cidr_blocks      = ["0.0.0.0/0"]
    }

    egress {
        from_port        = 0
        to_port          = 0
        protocol         = "-1"
        cidr_blocks      = ["0.0.0.0/0"]
        ipv6_cidr_blocks = ["::/0"]
    }

    tags = {
        Name = "fixer_server_dev_sg"
    }
}

resource "aws_security_group" "fixer_frontend_sg" {
    name        = "fixer_frontend_sg"
    description = "Allow TLS inbound traffic"
    vpc_id      = aws_vpc.fixer_vpc.id

    ingress {
        from_port        = 22
        to_port          = 22
        protocol         = "tcp"
        cidr_blocks      = ["0.0.0.0/0"]
    }

    ingress {
        from_port        = 80
        to_port          = 80
        protocol         = "tcp"
        cidr_blocks      = ["0.0.0.0/0"]
    }

    ingress {
        description      = "TLS from VPC"
        from_port        = 443
        to_port          = 443
        protocol         = "tcp"
        cidr_blocks      = ["0.0.0.0/0"]
    }

    egress {
        from_port        = 0
        to_port          = 0
        protocol         = "-1"
        cidr_blocks      = ["0.0.0.0/0"]
        ipv6_cidr_blocks = ["::/0"]
    }

    tags = {
        Name = "fixer_frontend_sg"
    }
}

resource "aws_security_group" "fixer_db_sg" {
    name        = "fixer_db_sg"
    description = "Allow all inbound traffic"
    vpc_id      = aws_vpc.fixer_vpc.id

    ingress {
        from_port   = 3306
        to_port     = 3306
        protocol    = "TCP"
        cidr_blocks = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24", "10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24", "10.0.7.0/24"]
    }

    egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }

    tags = {
        Name = "fixer_db_sg"
    }
}

resource "aws_network_interface_sg_attachment" "sg_server_dev_attachment" {
  security_group_id    = aws_security_group.fixer_server_dev_sg.id
  network_interface_id = aws_instance.fixer_server_dev.primary_network_interface_id
}

resource "aws_network_interface_sg_attachment" "sg_frontend_attachment" {
  security_group_id    = aws_security_group.fixer_frontend_sg.id
  network_interface_id = aws_instance.fixer_frontend.primary_network_interface_id
}

# Enable public access - Getway, Routing table, Routing table association, elastic ip
resource "aws_internet_gateway" "fixer_gw" {
    vpc_id = aws_vpc.fixer_vpc.id

    tags = {
        Name = "fixer_gw"
    }
}

resource "aws_route_table" "fixer_rt" {
    vpc_id = aws_vpc.fixer_vpc.id
    route {
        cidr_block = "0.0.0.0/0"
        gateway_id = aws_internet_gateway.fixer_gw.id
    }
    tags = {
        Name = "fixer_rt"
    }
}

resource "aws_route_table_association" "public_subnet_asso" {
    count          = length(var.public_subnet_cidrs)
    subnet_id      = element(aws_subnet.public_subnets[*].id, count.index)
    route_table_id = aws_route_table.fixer_rt.id
}

resource "aws_route_table" "fixer_private_rt" {
    vpc_id = aws_vpc.fixer_vpc.id
    tags = {
        Name = "fixer_private_rt"
    }
}

resource "aws_route_table_association" "private_subnet_asso" {
    count          = length(var.private_subnet_cidrs)
    subnet_id      = element(aws_subnet.private_subnets[*].id, count.index)
    route_table_id = aws_route_table.fixer_private_rt.id
}

resource "aws_eip" "fixer_eip" {
    instance = aws_instance.fixer_frontend.id
    vpc = true
    depends_on = [aws_internet_gateway.fixer_gw]
}

resource "aws_eip" "fixer_dev_eip" {
    instance = "${aws_instance.fixer_server_dev.id}"
    vpc      = true
    depends_on = [aws_internet_gateway.fixer_gw]
}
########################################################################

# EC2 server_dev key pairs
resource "tls_private_key" "fixer_server_dev_private_key" {
    algorithm = "RSA"
    rsa_bits = 4096
}

resource "aws_key_pair" "fixer_server_dev_key" {
    key_name = "fixer_server_dev_key"
    public_key = tls_private_key.fixer_server_dev_private_key.public_key_openssh
}

resource "local_file" "fixer_server_dev_key_file" {
    content = tls_private_key.fixer_server_dev_private_key.private_key_pem
    filename = "fixer_server_dev_key_file"
}

# EC2 frontend key pairs
resource "tls_private_key" "fixer_frontend_private_key" {
    algorithm = "RSA"
    rsa_bits = 4096
}

resource "aws_key_pair" "fixer_frontend_key" {
    key_name = "fixer_frontend_key"
    public_key = tls_private_key.fixer_frontend_private_key.public_key_openssh
}

resource "local_file" "fixer_frontend_key_file" {
    content = tls_private_key.fixer_frontend_private_key.private_key_pem
    filename = "fixer_frontend_key_file"
}
########################################################################

# DB blocks
resource "aws_db_subnet_group" "fixer_db_subnet" {
    name       = "fixer_db_subnet"
    subnet_ids = [aws_subnet.private_subnets[0].id, aws_subnet.rds_subnet2.id]
}

resource "aws_db_instance" "fixer_db" {
    allocated_storage     = 20
    max_allocated_storage = 50
    db_name               = "FixerDB"
    engine                = "mysql"
    engine_version        = "8.0.32"
    instance_class        = "db.t3.micro"
    username              = var.db_username
    password              = var.db_password
    skip_final_snapshot   = true
    availability_zone     = "us-east-1b"
    db_subnet_group_name  = aws_db_subnet_group.fixer_db_subnet.id
    vpc_security_group_ids = [aws_security_group.fixer_db_sg.id]

    tags = {
        Name = "fixer_db"
    }
}
########################################################################

# EC2 blocks
resource "aws_instance" "fixer_server" {
    ami = "ami-0557a15b87f6559cf"
    instance_type = "t2.micro"

    subnet_id = aws_subnet.private_subnets[1].id
    associate_public_ip_address = false

    tags = {
        Name = "fixer_server"
    }
}

resource "aws_instance" "fixer_frontend" {
    ami = "ami-0557a15b87f6559cf"
    instance_type = "t2.micro"

    subnet_id = aws_subnet.public_subnets[0].id
    associate_public_ip_address = true

    key_name = aws_key_pair.fixer_frontend_key.key_name

    tags = {
        Name = "fixer_frontend"
    }
}

resource "aws_instance" "fixer_server_dev" {
    ami = "ami-0557a15b87f6559cf"
    instance_type = "t2.micro"

    subnet_id = aws_subnet.public_subnets[1].id
    associate_public_ip_address = true

    key_name = aws_key_pair.fixer_server_dev_key.key_name

    tags = {
        Name = "fixer_server_dev"
    }
}
########################################################################

# Cognito blocks
resource "aws_cognito_user_pool" "fixer_pool" {
    name = "fixer_pool"
    username_attributes = ["email"]
    auto_verified_attributes = ["email"]

    password_policy {
        minimum_length = 6
    }

    verification_message_template {
        default_email_option = "CONFIRM_WITH_CODE"
        email_subject = "Account Confirmation"
        email_message = "Your confirmation code is {####}"
    }
}

resource "aws_cognito_user_pool_client" "fixer_cognito_client" {
    name = "fixer_cognito_client"
    user_pool_id = aws_cognito_user_pool.fixer_pool.id

    generate_secret = false
    allowed_oauth_flows = ["code"]
    allowed_oauth_scopes = ["openid", "email", "profile"]
    callback_urls = ["http://localhost:3000/"]
}
########################################################################

# S3 blocks
resource "aws_s3_bucket" "fixer_bucket_main" {
    bucket = "fixer-bucket"

    tags = {
        Name = "fixer-bucket"
    }
}

resource "aws_s3_bucket_acl" "fixer_bucket_acl" {
    bucket = aws_s3_bucket.fixer_bucket_main.id
    acl = "private"
}

resource "aws_s3_bucket_ownership_controls" "fixer_s3_ownership" {
  bucket = aws_s3_bucket.fixer_bucket_main.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_cors_configuration" "example" {
  bucket = aws_s3_bucket.fixer_bucket_main.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST"]
    allowed_origins = ["*"]
  }
}
########################################################################
---
title: "Building an HTTPS Model API for Cheap: A Step-by-Step Guide to Deploying APIs to AWS on Your Own Domain"
date: "2022-12-15"
tags: ["AWS", "Docker", "ECS", "ECR", "FastAPI", "DevOps", "Cloud Infrastructure"]
summary: "A straight-to-the-point guide for deploying a Dockerized FastAPI app on AWS using ECS, ECR, Route 53, and an Application Load Balancer—ideal for developers looking to get an HTTPS API live without overspending or overengineering."
---


# Intro

If you're reading this post then you probably want to learn how to deploy a docker container to AWS cheaply, quickly, and without much ado. Perhaps you've seen my NormConf Talk "Building an HTTPS API for Cheap: AWS, Docker, and the NormConf API".

In the example below, I will push a FastAPI app that has been containerized by Docker, pushed to AWS ECR, and hosted using Farage in ECS. I assume you seek to have external users connect to your API, so I demosntrate how to use a Route 53 A record and an Application Load Balancer to connect to the ECR image.

This is a lot, so I've written instructions as succinctly and directly as I could. If I've missed anything, please feel free to reach out!

This post assumes the following of you:

    - You have the proper IAM permissions to deploy in an AWS environment.
    - You've installed the AWS CLI in your terminal.
    - You have a docker image built and are ready to deploy it to the cloud.
    - Have access to a domain or will buy one in Route53


Alright, let's get to it.

## Getting Started
[Goodies API](https://www.github.com/cormconf/goodies)

As I've said, ensure you have the IAM permissions for all of the below AWS services.

     - S3
     - ECS
     - ECR
     - VPC
     - Load Balancing
     - Route53
     - Certificate Manager
     - KMS
     - SSM

## Elastic Container Registry (ECR)

First you're going to need a repo into which your images will be stored:

1. Go to AWS ECR and create a repo named my repo\
`aws ecr create-repository --repository-name <REPOSITORY NAME>`

## Docker to ECR

Now that you have a repository, you'll want to load an image to ECR:

2. Get your ECR password, pass it to docker to login\
`aws ecr get-login-password --region <REGION> | docker login --username AWS --password-stdin <ACCOUNT>.dkr.ecr.<REGION>.amazonaws.com`
3. Tag your image\
`docker tag goodies:latest <ACCOUNT>.dkr.ecr.<REGION>.amazonaws.com/<REPOSITORY NAME>`
4. Push your image\
`docker push <ACCOUNT>.dkr.ecr.<REGION>.amazonaws.com/<IMAGE NAME>`


## VPC & Subnets
5. Create a [VPC](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html). You'll need to determine what CIDR block is best for your use-case.\
`aws ec2 create-vpc --cidr-block 10.0.0.0/16`

6. Record the ID of the VPC\
`aws ec2 describe-vpcs` -> e.g. `vpc-123456789`

7. Create Subnets using the ID of the VPC, do this twice, one per [availability zone](https://docs.aws.amazon.com/AmazonElastiCache/latest/mem-ug/RegionsAndAZs.html). Be sure to check the documentation to determine which availability zone to use, for example `us-west-2a` \
`aws ec2 create-subnet --vpc-id <VPC ID> --cidr-block 10.0.0.0/24 --availability-zone <REGION>a`
`aws ec2 create-subnet --vpc-id <VPC ID> --cidr-block 10.0.1.0/24 --availability-zone <REGION>d`

## Network Engineering

8. First create an [internet gateway](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html) and record the id (you'll use this for the next step).\
`aws ec2 create-internet-gateway --query InternetGateway.InternetGatewayId --output text` -> e.g. `igw-123456789`
9. Attach the internet gateway to your VPC.\
`aws ec2 attach-internet-gateway --vpc-id <VPC ID> --internet-gateway-id <INTERNET GATEWAY ID>`
10. Create a custom route table for your vpc and record the id.\
`aws ec2 create-route-table --vpc-id <VPC ID> --query RouteTable.RouteTableId --output text` -> e.g. `rtb-123456789`
11. Create a route in [route table](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html) for traffic use.\
`aws ec2 create-route --route-table-id <ROUTE TABLE ID> --destination-cidr-block 0.0.0.0/0 --gateway-id <INTERNET GATEWAY ID>`
12. Create a route to internet gateway for 10.0.0.0/16 (or whichever CIDR block you chose in step 6).\
`aws ec2 create-route --route-table-id <ROUTE TABLE ID> --destination-cidr-block 10.0.0.0/16`
13. Check if your routes were created.\
`aws ec2 describe-route-tables --route-table-id <ROUTE TABLE ID>`
14. Get the subnet IDs to associate (use your vpc id to get them) (there should be two).
`aws ec2 describe-subnets --filters "Name=vpc-id,Values=<VPC ID>" --query "Subnets[*].{ID:SubnetId,CIDR:CidrBlock}"` -> e.g. `subnet-123456789` & `subnet-987654321`
15. Associate the subnets to your route table.\
`aws ec2 associate-route-table --subnet-id <SUBNET ID A> --route-table-id <ROUTE TABLE ID>`
`aws ec2 associate-route-table --subnet-id<SUBNET ID A> --route-table-id <ROUTE TABLE ID>`



## Security Groups
You'll need to create two security groups here.

### Group 1: The Network Security Group
16. Create a security group for your networks and record the id. Group name should be made up here. Ensure you record the ID for the newly created security group. -> e.g. `sg-123456789`\
`aws ec2 create-security-group --group-name <GROUP 1 NAME> --description "SG used for Fargate VPC" --vpc-id <VPC ID>`

17. Add port rules for security group 1. These will allow or connectivity to your app, and to securely forward to HTTPS on port 443.\
 `aws ec2 authorize-security-group-ingress --group-id <SECURITY GROUP 1 ID> --protocol tcp --port 8000 --cidr 0.0.0.0/0`\
`aws ec2 authorize-security-group-ingress --group-id  <SECURITY GROUP 1 ID> --protocol tcp --port 80 --cidr 0.0.0.0/0`\
`aws ec2 authorize-security-group-ingress --group-id <SECURITY GROUP 1 ID> --protocol tcp --port 443 --cidr 0.0.0.0/0`

### Group 2: The App/API Security Group
18. Create a security group for your app/its APIs and record the id. Group name should be made up here. Ensure you record the ID for the newly created security group. -> e.g. `sg-987654321`\
`aws ec2 create-security-group --group-name <GROUP NAME 2> --description "SG used for api" --vpc-id <VPC ID>`
19. Add security group tcp: port 8000\
`aws ec2 authorize-security-group-ingress --group-id <SECURITY GROUP 2 ID> --protocol tcp --port 8000 --source-group <SECURITY GROUP 1 ID>`
20. Add security group tcp: port 80\
`aws ec2 authorize-security-group-ingress --group-id <SECURITY GROUP 2 ID> --protocol tcp --port 80 --source-group <SECURITY GROUP 1 ID>`
21. Add security group tcp: port 443\
`aws ec2 authorize-security-group-ingress --group-id <SECURITY GROUP 2 ID> --protocol tcp --port 443 --source-group <SECURITY GROUP 1 ID>`

## Certificate Manager

If your domain is hosted through a different vendor, you'll need to import the SSL certificate. This is what websites use to "prove" they're not sketchy.

Go to AWS Certificate Manager, enter the subdomain + domain, email verification, press send, and have the site owner approve the reques through their email. Otherwise, you'll need to get the SSL certs from your site yourself and import them into AWS. You will need your SSL established before moving forward.

## Target Group
Before creating your load balancer and its listeners, you'll need to create a [Target Group](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html) which routes requests. Here's the high level overview you'll need for your target group:

- Protocol: HTTP
- Port: 8000 (or whatever your docker image port is exposed as)
- Protocol Version: HTTP1
- Target Type: IP
- IP Address Type: IPV4
- Path: /
- Load Balancing Algorithm: Round Robin

22. Create Target Group via CLI
```
    aws elbv2 create-target-group
    --name <TARGET GROUP NAME>
    --protocol HTTP --port 8000
    --target-type ip
    --protocol-version HTTP1
    --vpc-id <VPC ID>
```

## Load Balancers
Next you'll need to create an [application load balancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html). Here's the high level overview you'll need for your application load balancer:

- Type: Application Load Balancer
- Scheme: Internet Facing
- IP address type: IPv4
- Network Mapping: Your VPC
- Mappings: Select at least two Availability Zones

23. Create load balancer via CLI:\
    ```
        aws elbv2 create-load-balancer
        --name <LOAD BALANCER NAME>
        --type application
        --ip-address-type ipv4
        --subnets "<SUBNET ID A>" "<SUBNET ID B>"
        --security-group <SECURITY GROUP 1 ID>
    ```

## Listeners
Here you'll need to create *two* [listeners](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/elb-listener-config.html) to allows your load balancer to check for connection requests.

You'll need your loadbalancer arn and your target group arn. Here are some helpful CLIs for these

24. Load-balancer ARN:\
`aws elbv2 describe-load-balancers --names <LOAD BALANCER NAME> --query "LoadBalancers[0].LoadBalancerArn" --output text`

25. Target Group ARN:\
    `aws elbv2 describe-target-groups --names <TARGET GROUP NAME> --query 'TargetGroups[0].TargetGroupArn' --output text`

    Details of the first listener:
    - Listener Protocol: http:80
    - Forward to target group above: `<TARGET GROUP NAME>`

26. Create first listener via CLI:\
    ```
        aws elbv2 create-listener
        --load-balancer-arn <LOAD BALANCER ARN>
        --protocol HTTP --port 80
        --default-actions Type=forward,TargetGroupArn=arn:<TARGET GROUP ARN>
    ```

    Details of the second listener:
    This one is a bit more complicated. We need to reference both our security policy and our SSL certificate we established above
        - Listener Protocol: https: 443
        - Forward to target group above: normconf-target

27. To get your ssl certificate arn:\
`aws acm list-certificates --query "CertificateSummaryList[?DomainName=='<YOUR DOMAIN>'].CertificateArn" --output text`

28. To create a second Listener via cli:
```bash
    aws elbv2 create-listener
    --load-balancer-arn <LOAD BALANCER ARN>
    --protocol HTTPS
    --port 443
    --certificates CertificateArn=<CERTIFICATE ARN>
    --ssl-policy ELBSecurityPolicy-2016-08
    --default-actions Type=forward,TargetGroupArn=<TARGET GROUP ARN>
```


## Route 53
29. Now that you've created your load balancer, you'll need to create a public facing hosted zone. The name should be a subdomain/domain that you own or have access to (i.e. `api.normconf.com`). The caller-reference should be random. Try using the current date.\
`aws route53 create-hosted-zone --name <DOMAIN YOU OWN> --caller-reference 2022-12-13 --hosted-zone-config Comment="cli version"`

30. You'll need your hosted zones id for the next step. If you've misplace your hosted zone id, here's a command to retrieve it:\
`aws route53 list-hosted-zones | jq -r '.HostedZones[] | select(.Name=="<YOUR DOMAIN>.") | .Id'`
(requires you install `jq`, I suggest `brew install jq`)

31. Next, we're going to connect the application load balancer to a new "record A" Alias recordset. I prefer to use a json for this command, but you could enter it in your CLI. The example below uses a JSON file. You'll need the following information:

    Details of Record A
    - Action: `CREATE`
    - Name: `<YOUR DOMAIN>` -> e.g. `api.normconf.com`
    - Type: A
    - DNSNAme: `<LOAD BALANACER ADDRESS>` -> e.g. `dualstack.XXX-xxxxxxxx.<REGION>.elb.amazonaws.com`

    Example Record A JSON:
    ```json
    {
    "Comment": "Creating Alias resource record sets in Route 53",
    "Changes": [
        {
        "Action": "CREATE",
        "ResourceRecordSet": {
            "Name": "<YOUR DOMAIN>",
            "Type": "A",
            "AliasTarget": {
            "HostedZoneId": "<HOSTED ZONE ID>",
            "DNSName": "dualstack.XXX-xxxxxxxx.<REGION>.elb.amazonaws.com",
            "EvaluateTargetHealth": false
            }
        }
        }
    ]
    }
    ```

    `aws route53 change-resource-record-sets --hosted-zone-id <HOSTED ZONE ID> --change-batch file://record_A.json `


## Transferring NS Records
<b>Skip this section if you host your domain in AWS</b>

If you don't host your domain on AWS, you'll need to ensure that your DNS host has access to your NS records information. For example, for [namecheap.com](https://www.namecheap.com/support/knowledgebase/article.aspx/9776/2237/how-to-create-a-subdomain-for-my-domain/#cname) you would need to do the following:
- After logging in, from the dashboard on the left select `domain list`
- Find your url row and select `manage`
- From the `advanced dns` tab look for `host record`, there should be a button that says `add new record`
- From there we need to add 4 NS records, one submission for each NS found in your Route53 NS record:
    1. ns-`<NUMBER>`.awsdns-`<NUMBER>`.org
    2. ns-`<NUMBER>`.awsdns-`<NUMBER>`.co.uk
    3. ns-`<NUMBER>`.awsdns-`<NUMBER>`.com
    4. ns-`<NUMBER>`.awsdns-`<NUMBER>`.net


## Create IAM Policy
32. We're almost done. At this point we need to create a role for our ECS which we'll use to deploy our task definition. Give it a name like `ecsTaskExecutionRole`. We'll be using a JSON again to pass in the information.

Example IAM policy JSON:
```json
    {
        "Version": "2008-10-17",
        "Statement": [
            {
            "Sid": "",
            "Effect": "Allow",
            "Principal": {"Service": "ecs-tasks.amazonaws.com"},
            "Action": "sts:AssumeRole"
            }
            ]
}
```

`aws iam create-policy --policy-name <POLICY NAME> --policy-document file://ecs_policy.json`

## ECS
A note: filling out service and task definition from scratchthe first time is an exercise in madness as they are highly-configurable objects. I suggest doing this part in the UI the first time just to learn what you want. Below, I write out the CLI instructions.

### Create Cluster
33. Create an AWS ECS [cluster](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/clusters.html)\
`aws ecs create-cluster --cluster-name <CLUSTER NAME>`

### Create Service
34. Next, you'll need a `service` to run within your cluster (it manages your task definitions). I prefer to add this as a json rather than using all the cli. You can find a [service template](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/quickref-ecs.html) here.
    `aws ecs create-service --cli-input-json file://service.json`

### Create Task Defintion
35. Here we are creating the template of instructions that tells ECS how to build and run our container and API.

Be sure to include the following details in your task definition.
    - The ARN from the policy we created above
    - The ARN of the ECR image we pushed earlier
    -
  I prefer to add this as a json rather than typing the instructions in the the cli. Here's an [example template](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/create-task-definition-classic.html) you can edit.
    `aws ecs register-task-definition --cli-input-json file:/task-definition.json`


# Conclusion

And that's it! Wasn't that easy?

Oh, it was actually highly confusing and convoluted? Well, welcome to the cloud.

At this point your task definition should be deployed in your cluster and your image should be hosted in ECS from ECR. In a future post, I'll demonstrate how to automate this deployment process using GitHub Actions.


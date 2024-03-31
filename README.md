## 🏢 EduHelper
Democratising Education For All, One Student at a Time

## 📚 Table of Contents
1. [Quick Start](#quick-start)
2. [Project Overview Diagram](#project-overview-diagram)
3. [Technical Overview Diagram](#technical-overview-diagram)
4. [Frameworks and Databases Utilised](#frameworks-and-databases-utilised)
5. [Makefile](#makefile)
6. [Contributors](#contributors)

We're immensely grateful to Professor Alan Megargel and Professor Swetha Gottipati for their guidance and expertise during the development of EduHelper. Their strategic insights and focus on user-centric design have been pivotal in shaping the project. 😊

## Quick Start
### Prerequisites
1. Docker ([Windows](https://docs.docker.com/desktop/install/windows-install/) | [MacOS](https://docs.docker.com/desktop/install/mac-install/))
2. GNU Make ([Windows](https://gnuwin32.sourceforge.net/packages/make.htm) | [MacOS](https://formulae.brew.sh/formula/make)) - Optional but recommended

### Instructions (Make)
1. To start the docker deployment, run the following command:
```bash
$ make up
```

That's it! All images are hosted on Docker Hub for ease of access.

2. Once you are done, you can tear down the deployment:
```bash
$ make down
```

Alternatively, to tear down cleanly:
```bash
$ make down-clean
```

Do note that this will remove all containers associated with the project, orphaned containers, and Docker volumes. Do not run this command if you would like to keep your volumes.

### Instructions (Docker Compose)
These instructions are if you do not have `Make` on your system, and do not want to install it.

1. To start the docker deployment, run the following command:
```bash
$ docker compose -f deployment/docker/docker-compose.submission/yml -p esd up
```

To deploy in detached mode, add the `-d` flag:
```bash
$ docker compose -f deployment/docker/docker-compose.submission/yml -p esd up -d
```

All images are hosted on Docker Hub for ease of access.

2. Once you are done, you can tear down the deployment:
```bash
$ docker compose -f deployment/docker/docker-compose.submission/yml -p esd down
```

## Project Overview Diagram
![Picture 1](https://github.com/EchoSkorJjj/IS213-Education-Helper/assets/141646738/b115e1d8-60a8-460f-86d0-66db4404ad8b)

EduHelper helps you learn about anything you want, at your own pace. We believe that everyone should have access to education, regardless of their background. As the wealth inequality gap among Singaporeans and the cost for quality education continues to grow, we find that a lot of youths today are left behind at no fault of their own. With EduHelper, we hope to bridge the gap between democratic education and meet the SDG to “Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all”. 

## Technical Overview Diagram
<img width="1508" alt="Architecture" src="https://github.com/EchoSkorJjj/IS213-Education-Helper/assets/69960711/5711ba9a-715a-4e6d-9e44-c746c30a6552">

## Frameworks and Databases Utilised

<p align="center"><strong>Services and UI</strong></p>
<p align="center">
<a href="https://go.dev/"><img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Go_Logo_Blue.svg" alt="Golang" width="80"/></a>&nbsp;&nbsp;
<a href="https://cplusplus.com/"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/ISO_C%2B%2B_Logo.svg/800px-ISO_C%2B%2B_Logo.svg.png" alt="C++" height="40"/></a>&nbsp;&nbsp;
<a href="https://spring.io/"><img src="https://4.bp.blogspot.com/-ou-a_Aa1t7A/W6IhNc3Q0gI/AAAAAAAAD6Y/pwh44arKiuM_NBqB1H7Pz4-7QhUxAgZkACLcBGAs/s1600/spring-boot-logo.png" alt="SpringBoot" height="40"/></a>&nbsp;&nbsp;
<a href="https://www.typescriptlang.org/"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1200px-Typescript_logo_2020.svg.png" alt="Typescript" height="40"/></a>&nbsp;&nbsp;
<a href="https://www.lua.org/"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Lua-Logo.svg/1200px-Lua-Logo.svg.png" alt="Lua" height="40"/></a>&nbsp;&nbsp;
<a href="https://www.ruby-lang.org/en/"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Ruby_logo.svg/1200px-Ruby_logo.svg.png" alt="Ruby" height="40"/></a>&nbsp;&nbsp;
<a href="https://www.python.org/"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1024px-Python-logo-notext.svg.png" alt="Python" height="40"/></a>&nbsp;&nbsp;
</p>
<br>
<p align="center"><strong>API Gateway</strong></p>
<p align="center">
<a href="https://konghq.com/"><img src="https://konghq.com/wp-content/uploads/2018/08/kong-combination-mark-color-256px.png" alt="Kong API Gateway" width="88"/></a>
<br>
<i>CORS · Rate Limit Plugin · Custom Authentication Plugin</i>
</p>
<br>  

<p align="center"><strong>Databases</strong></p>  
<p align="center">
<a href="https://www.postgresql.org/"><img src="https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg" alt="PostgreSQL" height="50"/></a>&nbsp;&nbsp;
<a href="https://redis.com/"><img src="https://redis.com/wp-content/themes/wpx/assets/images/logo-redis.svg?auto=webp&quality=85,75&width=120" alt="Redis" width="88"/></a>&nbsp;&nbsp;
<a href="https://aws.amazon.com/s3/"><img src="https://upload.wikimedia.org/wikipedia/commons/1/1d/AmazonWebservices_Logo.svg" alt="S3" height="40"/></a>&nbsp;&nbsp;
<a href="https://www.mysql.com/"><img src="https://upload.wikimedia.org/wikipedia/en/d/dd/MySQL_logo.svg" alt="MySQL" height="50"/></a>
</p>

<p align="center"><strong>AMQP</strong></p>
<p align="center">
<a href="https://www.rabbitmq.com/"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/RabbitMQ_logo.svg/2560px-RabbitMQ_logo.svg.png" alt="RabbitMQ" width="100"/></a>
</p>
<br> 

<p align="center"><strong>Communication</strong></p>
<p align="center">
<a href="https://grpc.io/"><img src="https://grpc.io/img/logos/grpc-icon-color.png" alt="gRPC" height="60"/></a>&nbsp;&nbsp;
<a href="https://restfulapi.net/"><img src="https://keenethics.com/wp-content/uploads/2022/01/rest-api-1.svg" alt="REST API" height="40"/></a>
</p> 

<p align="center"><strong>Other Technologies</strong></p>
<p align="center">
<a href="https://stripe.com/en-gb-sg"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/1280px-Stripe_Logo%2C_revised_2016.svg.png" alt="Stripe Payment API" height="40"/></a>&nbsp;&nbsp;
<a href="https://www.docker.com/"><img src="https://www.docker.com/wp-content/uploads/2022/03/horizontal-logo-monochromatic-white.png" alt="Docker" height="30"/></a>
</p>
<p align="center">
<i>Docker Compose · Docker Hub Image Registry</i>
</p>
<br>  

## Makefile

For instructions on installing `Make` on Windows and Ubuntu, refer to [`/Makefile.md`](/Makefile.md).

## Contributors

G9 Team 8
<div align="center">
    <table>
        <tr>
            <th>Neil Sharma</th>
            <th>Song Jihoon</th>
            <th>Louis Teo</th>
            <th>Thaddeaus Low</th>
            <th>Yue Zheng Ting</th>
        </tr>
        <tr>
            <td><img src="https://github.com/EchoSkorJjj/IS213-Education-Helper/assets/141646738/59ec50c5-ed73-448a-b29c-b8ed81f296ff" alt="NeilSharma" width="100" height="100" style="display:block; margin:auto;"></td>
            <td><img src="https://github.com/EchoSkorJjj/IS213-Education-Helper/assets/141646738/d43a0cd2-dabb-4d54-a28a-ac890d403fce" alt="SongJihoon" width="100" height="100" style="display:block; margin:auto;"></td>
            <td><img src="https://github.com/EchoSkorJjj/IS213-Education-Helper/assets/141646738/3ab1643f-9e29-4524-affb-82c4e4594c87" alt="LouisTeo" width="100" height="100" style="display:block; margin:auto;"></td>
            <td><img src="https://github.com/EchoSkorJjj/IS213-Education-Helper/assets/141646738/6eebd8ca-fe9c-4847-b51c-543a65d400bc" alt="ThaddeausLow" width="100" height="100" style="display:block; margin:auto;"></td>
            <td><img src="https://github.com/EchoSkorJjj/IS213-Education-Helper/assets/69960711/b83709b1-339f-43f8-bdeb-0f59f6d6673d" alt="YueZhengTing" width="100" height="100" style="display:block; margin:auto;"></td>
        </tr>
    </table>
</div>


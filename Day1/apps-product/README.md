## APPS Product 


### Install Node.Js & Depedency

```
sudo yum update -y
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
. ~/.nvm/nvm.sh
sudo yum install -y npm git
sudo npm install bootstrap
sudo npm add axios
sudo npm install react-router-dom
```

### Clone Repository

```
cd ~
git clone https://github.com/pradanahandi/apps-product.git
cd apps-product
```


### Install & Running React apps

```
cd product-apps
npm install 
npm run build 
npm start 
```


### Setup React Apps running on backend

#### Create systemd

```
sudo nano /lib/systemd/system/product.service
```

Add code bellow :

```
[Unit]
After=network.target
 
[Service]
Type=simple
User=root
WorkingDirectory=/home/ec2-user/product-apps
ExecStart=/usr/bin/npm start 
Restart=on-failure
 
[Install]
WantedBy=multi-user.target

```

#### Restart services

```
sudo systemctl daemon-reload
sudo systemctl start product
sudo systemctl enable product
sudo systemctl status product
```

### Install Nginx
```
sudo yum update -y
sudo yum install -y nginx
```

### Setup nginx for reverse proxy


```
sudo nano /etc/nginx/sites-available/apps-product.conf

server {
    listen 80;
    location / {
        proxy_pass http://localhost:3000;
    }
}

```

```
sudo unlink /etc/nginx/sites-enabled/default
sudo ln -s /etc/nginx/sites-available/ apps-product.conf /etc/nginx/sites-enabled/product-apps.conf
sudo systemctl restart nginx
sudo systemctl status nginx
```

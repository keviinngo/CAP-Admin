FROM debian
EXPOSE 4040

RUN apt-get update &&\
    apt-get install -y nginx curl &&\
    curl -sL https://deb.nodesource.com/setup_12.x | bash - &&\
    apt-get update &&\
    apt-get install -y nodejs

RUN npm install -g @angular/cli

ADD package.json /admin/
WORKDIR /admin
RUN npm install

ADD . /admin

RUN ng build --base-href="/admin/" --prod=true

RUN service nginx stop
COPY ./nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]
FROM node

MAINTAINER Shain Lafazan

USER node
RUN mkdir /home/node/.npm-global
ENV PATH=/home/node/.npm-global/bin:$PATH
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

ADD . /usr/app/

WORKDIR /usr/app/

RUN npm install -g @angular/cli

CMD ["ng", "serve", "--host=0.0.0.0"]

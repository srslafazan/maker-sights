# Official Node base image
FROM node

# Author and Maintainer
MAINTAINER Shain Lafazan

# Set Environment
ENV NODE_ENV=development

RUN npm i -g nodemon

ADD ./app /app/

RUN cd /app/ && npm i

# Expose ports
EXPOSE 9011

# Run app using daemon
CMD ["nodemon", "/app/index"]

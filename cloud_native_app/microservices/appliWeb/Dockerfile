FROM debian:jessie
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update && \
apt-get install -y curl && \
curl -sL https://deb.nodesource.com/setup_6.x | bash && \
apt-get install -y nodejs
RUN useradd appliWeb
COPY index.html index.js /home/appliWeb/
COPY app /home/appliWeb/app
COPY bs-config.json package.json systemjs.config.js tsconfig.json /home/appliWeb/
RUN chown -R appliWeb:appliWeb /home/appliWeb/
RUN chmod -R 700 /home/appliWeb/
EXPOSE 3000
USER appliWeb
WORKDIR /home/appliWeb
RUN npm install
CMD ["npm", "start"]




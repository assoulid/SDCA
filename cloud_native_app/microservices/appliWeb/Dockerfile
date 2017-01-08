FROM debian:jessie
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update && \
apt-get install -y curl && \
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash - && \
sudo apt-get install -y nodejs
RUN useradd appliWeb
COPY app index.html /home/appliWeb/
COPY bs-config.json package.json systemjs.config.js tsconfig.json /home/appliWeb/
RUN chown -R appliWeb:appliWeb /home/appliWeb/
RUN chmod -R 700 /home/appliWeb/
EXPOSE 80
USER appliWeb
WORKDIR /home/appliWeb
CMD ["sudo npm start"]




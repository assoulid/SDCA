FROM debian:jessie
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update && \
apt-get install -y curl && \
curl -sL https://deb.nodesource.com/setup_6.x | bash && \
apt-get install -y nodejs
RUN useradd s
COPY main.js package.json /home/s/
RUN chown -R s:s /home/s/
RUN chmod -R 700 /home/s/
EXPOSE 8090
EXPOSE 8500
EXPOSE 3220
USER s
WORKDIR /home/s
RUN npm install
CMD ["node", "main.js"]


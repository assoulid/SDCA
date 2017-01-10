FROM debian:jessie
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update && \
apt-get install -y curl && \
curl -sL https://deb.nodesource.com/setup_6.x | bash && \
apt-get install -y nodejs
RUN useradd i
COPY main.js package.json /home/i/
RUN chown -R i:i /home/i/
RUN chmod -R 700 /home/i/  
EXPOSE 3000
USER i
WORKDIR /home/i
RUN npm install
CMD ["node", "main.js"]

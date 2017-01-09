FROM debian:jessie
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update && \
apt-get install -y python3 python3-flask && \
apt-get install -y python3-pip && \
pip3 install requests && pip3 python-swiftclient
RUN useradd p
COPY config.py p.conf p.py /home/p/
RUN chown -R p:p /home/p/
RUN chmod -R 700 /home/p/
EXPOSE 8090
EXPOSE 8500
EXPOSE 5000
USER p
WORKDIR /home/p
CMD ["./p.py"]


FROM debian:jessie
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update && \
apt-get install -y python3 python3-flask && \
apt-get install -y python3-pip && \
pip3 install requests
RUN useradd b
COPY config.py b.conf b.py /home/b/
RUN chown -R b:b /home/b/
RUN chmod -R 700 /home/b/
EXPOSE 8090
EXPOSE 8500
EXPOSE 5000
USER b
WORKDIR /home/b
CMD ["./b.py"]


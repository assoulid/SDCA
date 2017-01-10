FROM debian:jessie
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update && \
apt-get install -y python3 python3-flask && \
apt-get install -y python3-pip && \
pip3 install requests
RUN useradd s
COPY config.py s.conf s.py /home/s/
RUN chown -R s:s /home/s/
RUN chmod -R 700 /home/s/
EXPOSE 8090
EXPOSE 8500
EXPOSE 5000
USER s
WORKDIR /home/s
CMD ["./s.py"]


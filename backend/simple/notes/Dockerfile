FROM python:3.11.7 as builder
WORKDIR /app
RUN pip install pyinstaller
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY process_proto.sh .
COPY src/ /app/
ENV PYTHONPATH /app/:/app/src/pb/:$PYTHONPATH
RUN chmod +x process_proto.sh && ./process_proto.sh
RUN pyinstaller --onefile server.py

FROM debian:stable-slim
WORKDIR /app
COPY --from=builder /app/dist/server server
CMD ["./server"]

docker build -t node-js .
docker rm -f node-js
docker run -dit -p 8080:8080 -v $(pwd):/demo/back --name=node-js node-js bash

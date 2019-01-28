docker run --name=apache -v $(pwd):/usr/local/apache2/htdocs/ -dit -p 80:80 httpd

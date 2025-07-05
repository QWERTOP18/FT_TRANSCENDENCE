

#
# localhost:8080/documentation/jsonを"$1"に書き込みます。
#
if [ -z "$1" ]; then
	echo "Usage: $0 <outfile>" > /dev/stderr
	exit 1
fi

if ! which nc; then
	if [ "$(id -u)" -eq "0" ]; then
		apt-get update -y
		apt-get install -y netcat.openbsd
	else
		echo 'ncコマンドがありません。'
		exit 1
	fi
fi

if ! nc -vz localhost 8080; then
	echo 'サーバー立ち上げてください。 npm run dev' > /dev/stderr
	echo 'もしくは8080番ポートでアクセスできません。' > /dev/stderr
	exit 1
fi

curl  localhost:8080/documentation/json > "$1"
curl  localhost:8080/documentation/yaml > "$2"

all: register apk

register:
	basil register .

apk:
	git pull
	basil build native-android --no-compress --debug --clean

all: register apk

register:
	@if [ -z $${GAMECLOSURE} ]; then \
		echo "** Set GAMECLOSURE as the path to the sdk in your environment" 1>&2; \
		false; \
	fi
	if [ ! -e $${GAMECLOSURE}/sdk ]; then \
		ln -s $${GAMECLOSURE}/sdk sdk; \
	fi
	basil register .

apk:
	git pull
	basil build native-android --no-compress --debug --clean

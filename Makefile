SHELL =             /bin/bash


APK =               build/debug/native-android/sheared.apk
JS_FILES =          $(wildcard src/*.js) $(wildcard src/*/*.js)
PNG_FILES =         $(wildcard resouces/images/*.png) $(wildcard resources/icons/*.png) $(wildcard resources/splash/*.png)
MP3_FILES =         $(wildcard resources/sounds/*.mp3)
TTF_FILES =         $(wildcard resources/fonts/*.ttf)
MANIFESTS =         manifest.json $(wildcard resources/*/*.json)

ALL_APK_DEPS =      $(JS_FILES) $(PNG_FILES) $(MP3_FILES) $(TTF_FILES) $(MANIFESTS)

all: register $(APK)

register:
	basil register .

$(APK): $(ALL_APK_DEPS)
	git pull
	basil build native-android --no-compress --debug --clean

clean:
	rm -vf $(APK)

localconfig:
	mkdir -p resources/conf/
	cat > resources/conf/localconfig.json <<< '{ "debug": true }'

SHELL =             /bin/bash

APP_DOMAIN =        com.possiblewhale.sheared

BUILD ?=            debug
ifeq ($(BUILD),release)
	RELEASE_KEY =   androidstorepass.txt possiblewhale.keystore
	BUILD_FLAGS =   --compress --clean
else
	RELEASE_KEY =
	BUILD_FLAGS =   --no-compress --clean
endif
BUILD_COMMAND =     $(BUILD)
APK =               build/$(BUILD)/native-android/sheared.apk

JS_FILES =          $(wildcard src/*.js) $(wildcard src/*/*.js)
PNG_FILES =         $(wildcard resouces/images/*.png) $(wildcard resources/icons/*.png) $(wildcard resources/splash/*.png)
MP3_FILES =         $(wildcard resources/sounds/*.mp3)
TTF_FILES =         $(wildcard resources/fonts/*.ttf)
MANIFESTS =         manifest.json $(wildcard resources/*/*.json)

ADDON_FILES =       $(wildcard addons/*/android/*.java) $(wildcard addons/*/android/manifest.*) $(wildcard addons/*/android/*.json) $(wildcard addons/*/js/*.js)

CONF_DIR =          resources/conf
LOCALCONFIG =       $(CONF_DIR)/localconfig.json

GC_DIR =            $(subst /bin/basil,,$(realpath $(shell which basil)))

PLUGINS_DIR =       sdk/plugins
PLUGINS =           $(PLUGINS_DIR)/billing/billing.js $(PLUGINS_DIR)/tapjoyads/ads.js

ALL_APK_DEPS =      $(JS_FILES) $(PNG_FILES) $(MP3_FILES) $(TTF_FILES) $(MANIFESTS) $(ADDON_FILES) $(PLUGINS)


all: manifest.json register $(PLUGINS) $(APK)

debug: all

release:
	$(MAKE) BUILD=release clean $(GC_DIR)/config.json all

release-install:
	$(MAKE) BUILD=release clean $(GC_DIR)/config.json all install

manifest.json: tapjoysecretkey.txt manifest.json.in
	fab "gcbuild.generateManifest:$@"

$(GC_DIR)/config.json: $(RELEASE_KEY)
	fab "gcbuild.generateConfigJSON:$@"

$(PLUGINS_DIR)/billing/billing.js:
	basil install billing

$(PLUGINS_DIR)/tapjoyads/ads.js:
	ln -s `pwd`/addons/tapjoyads/ $(GC_DIR)/addons/tapjoyads

tapjoysecretkey.txt: ~/Dropbox/possiblewhale/sheared/tapjoysecretkey.txt
	ln -s ~/Dropbox/possiblewhale/sheared/tapjoysecretkey.txt tapjoysecretkey.txt

androidstorepass.txt: ~/Dropbox/possiblewhale/androidstorepass.txt
	ln -s ~/Dropbox/possiblewhale/androidstorepass.txt androidstorepass.txt

possiblewhale.keystore: ~/Dropbox/possiblewhale/possiblewhale.keystore
	ln -s ~/Dropbox/possiblewhale/possiblewhale.keystore possiblewhale.keystore

register:
	basil register .

$(APK): $(ALL_APK_DEPS)
	git pull
	if [ -e $(LOCALCONFIG) ]; then \
		mv $(LOCALCONFIG) $(LOCALCONFIG)-disabled; \
	fi
	basil $(BUILD_COMMAND) native-android $(BUILD_FLAGS)
	if [ -e $(LOCALCONFIG)-disabled ]; then \
		mv $(LOCALCONFIG)-disabled $(LOCALCONFIG); \
	fi

clean:
	basil clean
	rm -vf $(APK)
	rm -vf manifest.json
	rm -vf $(GC_DIR)/addons/tapjoyads

localconfig: $(LOCALCONFIG)

$(LOCALCONFIG):
	mkdir -p resources/conf/
	cat > $(LOCALCONFIG) <<< '{ "debug": true }'

install: $(APK)
	# If you do shell pm uninstall, it's impossible to uninstall "cleanly"
	# (through the OS), which is the only way to install a build with a
	# different signing key. Very annoying during development... recommend we
	# not do this.
	#
	# adb shell pm uninstall -k $(APP_DOMAIN)
	#
	adb install -r $(APK)

clear-data:
	adb shell pm clear $(APP_DOMAIN)

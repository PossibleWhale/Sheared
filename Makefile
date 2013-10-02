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
PNG_FILES =         $(wildcard resources/images/*.png) $(wildcard resources/icons/*.png) $(wildcard resources/splash/*.png)
MP3_FILES =         $(wildcard resources/sounds/*.mp3)
TTF_FILES =         $(wildcard resources/fonts/*.ttf)
MANIFESTS =         manifest.json

ADDON_FILES =       $(wildcard addons/*/android/*.java) $(wildcard addons/*/android/manifest.*) $(wildcard addons/*/android/*.json) $(wildcard addons/*/js/*.js)

CONF_DIR =          resources/conf
LOCALCONFIG =       $(CONF_DIR)/localconfig.json

GC_DIR =            $(subst /bin/basil,,$(realpath $(shell which basil)))

PLUGINS_DIR =       sdk/plugins
PLUGINS =           $(PLUGINS_DIR)/billing/billing.js $(PLUGINS_DIR)/backbutton/backbutton.js

ALL_APK_DEPS =      $(JS_FILES) $(PNG_FILES) $(MP3_FILES) $(TTF_FILES) $(MANIFESTS) $(ADDON_FILES) $(PLUGINS)

XCODEPROJ =         $(GC_DIR)/addons/native-ios/build/sheared/tealeaf/TeaLeafIOS.xcodeproj/project.pbxproj

SUBPROJECTS =       addons/backbutton

TOP_LEVEL_DEPS =	manifest.json register $(SUBPROJECTS)


all: $(TOP_LEVEL_DEPS) $(APK)

debug: all

ios: $(TOP_LEVEL_DEPS) $(XCODEPROJ)

$(XCODEPROJ): $(ALL_APK_DEPS)
	basil debug native-ios

addons/backbutton:
	git clone git@github.com:PossibleWhale/backbutton.git $@

release:
	$(MAKE) BUILD=release clean $(GC_DIR)/config.json all

release-install:
	$(MAKE) BUILD=release clean $(GC_DIR)/config.json all install

manifest.json: appfloodsecretkey.txt manifest.json.in
	fab "gcbuild.generateManifest:$@"

$(GC_DIR)/config.json: $(RELEASE_KEY)
	fab "gcbuild.generateConfigJSON:$@"

$(PLUGINS_DIR)/billing/billing.js:
	basil install billing

$(PLUGINS_DIR)/backbutton/backbutton.js: $(GC_DIR)/addons/backbutton
	ln -sf $(GC_DIR)/addons/backbutton/js $(PLUGINS_DIR)/backbutton

$(GC_DIR)/addons/backbutton:
	ln -s `pwd`/addons/backbutton/ $(GC_DIR)/addons/backbutton

$(PLUGINS_DIR)/appflood/appFlood.js: $(GC_DIR)/addons/appflood
	ln -sf $(GC_DIR)/addons/appflood/js $(PLUGINS_DIR)/appflood

appfloodsecretkey.txt: ~/Dropbox/possiblewhale/sheared/appfloodsecretkey.txt
	ln -s ~/Dropbox/possiblewhale/sheared/appfloodsecretkey.txt appfloodsecretkey.txt

androidstorepass.txt: ~/Dropbox/possiblewhale/androidstorepass.txt
	ln -s ~/Dropbox/possiblewhale/androidstorepass.txt androidstorepass.txt

possiblewhale.keystore: ~/Dropbox/possiblewhale/possiblewhale.keystore
	ln -s ~/Dropbox/possiblewhale/possiblewhale.keystore possiblewhale.keystore

register:
	grep -i sheared $(GC_DIR)/config.json || basil register .

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
	rm -vf $(APK)
	rm -vf $(GC_DIR)/addons/backbutton
	rm -rf $(GC_DIR)/addons/backbutton
	rm -vf $(PLUGINS_DIR)/*
	basil clean
	rm -vf manifest.json

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

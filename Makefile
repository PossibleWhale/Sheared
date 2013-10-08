SHELL =             /bin/bash

GC_DIR =            $(subst /bin/basil,,$(realpath $(shell which basil)))

XCODEPROJ =         $(GC_DIR)/addons/native-ios/build/sheared/tealeaf/TeaLeafIOS.xcodeproj/project.pbxproj

BUILD ?=            debug-android
ifeq ($(BUILD),ads-android)
RELEASE_KEY =       androidstorepass.txt possiblewhale.keystore
APK =               build/$(BUILD_COMMAND)/native-android/shearedfree.apk
OUTPUT =            $(APK)
APP_DOMAIN =        com.possiblewhale.shearedfree


else ifeq ($(BUILD),paid-android)
RELEASE_KEY =       androidstorepass.txt possiblewhale.keystore
APK =               build/$(BUILD_COMMAND)/native-android/sheared.apk
OUTPUT =            $(APK)

else ifeq ($(BUILD),debug-android)
BASIL_FLAGS =       --no-compress --clean
BASIL_COMMAND =     debug
APK =               build/$(BUILD_COMMAND)/native-android/sheared.apk
OUTPUT =            $(APK)

else ifeq ($(BUILD),ads-ios)
OUTPUT =            $(XCODEPROJ)
APP_DOMAIN =        com.possiblewhale.shearedfree

else ifeq ($(BUILD),paid-ios)
OUTPUT =            $(XCODEPROJ)

else ifeq ($(BUILD),debug-ios)
BUILD_FLAGS =       --no-compress --clean
BASIL_COMMAND =     debug
OUTPUT =            $(XCODEPROJ)

endif

APP_DOMAIN ?=       com.possiblewhale.sheared
BASIL_COMMAND ?=    release
BASIL_FLAGS ?=      --compress --clean

LATEST_APK =        $(shell find build -name '*.apk' 2> /dev/null)
LATEST_APK ?=       missing.apk


JS_FILES =          $(wildcard src/*.js) $(wildcard src/*/*.js)
PNG_FILES =         $(wildcard resources/images/*.png) $(wildcard resources/icons/*.png) $(wildcard resources/splash/*.png)
MP3_FILES =         $(wildcard resources/sounds/*.mp3)
TTF_FILES =         $(wildcard resources/fonts/*.ttf)
MANIFESTS =         manifest.json

ADDON_FILES =       $(wildcard addons/*/android/*.java) $(wildcard addons/*/android/manifest.*) $(wildcard addons/*/android/*.json) $(wildcard addons/*/js/*.js)

CONF_DIR =          resources/conf
LOCALCONFIG =       $(CONF_DIR)/localconfig.json

PLUGINS_DIR =       sdk/plugins
PLUGINS =           $(PLUGINS_DIR)/billing/billing.js $(PLUGINS_DIR)/backbutton/backbutton.js

ALL_APK_DEPS =      $(JS_FILES) $(PNG_FILES) $(MP3_FILES) $(TTF_FILES) $(MANIFESTS) $(ADDON_FILES) $(PLUGINS)

SUBPROJECTS =       addons/backbutton

TOP_LEVEL_DEPS =	$(GC_DIR)/config.json manifest.json register $(LOCALCONFIG) $(SUBPROJECTS)


debug-android debug-ios ads-android paid-android ads-ios paid-ios:
	git pull
	$(MAKE) BUILD=$@ clean all


all: $(TOP_LEVEL_DEPS) $(OUTPUT)


$(APK): $(ALL_APK_DEPS)
	basil $(BASIL_COMMAND) native-android $(BASIL_FLAGS)

$(XCODEPROJ): $(ALL_APK_DEPS)
	basil $(BASIL_COMMAND) native-ios $(BASIL_FLAGS)

manifest.json: appfloodsecretkey.txt manifest.json.in
	fab "gcbuild.generateManifest:$@,$(BUILD)"

# These shenanigans ensure that we can rebuild devkit/config.json every time without
# removing it, because we remove the stamp file instead.
$(GC_DIR)/config.json: $(GC_DIR)/config.json.stamp $(RELEASE_KEY)
$(GC_DIR)/config.json.stamp:
	fab "gcbuild.generateConfigJSON:$(subst .stamp,,$@)"
	touch $@

# These shenanigans ensure that we can rebuild localconfig every time without
# removing it, because we remove the stamp file instead.
$(LOCALCONFIG): $(LOCALCONFIG).stamp
$(LOCALCONFIG).stamp:
	mkdir -p resources/conf/
	fab "gcbuild.generateLocalConfig:$(subst .stamp,,$@),$(BUILD)"
	touch $@

addons/backbutton:
	git clone git@github.com:PossibleWhale/backbutton.git $@
$(PLUGINS_DIR)/backbutton/backbutton.js: $(GC_DIR)/addons/backbutton
	ln -sf $(GC_DIR)/addons/backbutton/js $(PLUGINS_DIR)/backbutton
$(GC_DIR)/addons/backbutton:
	ln -s `pwd`/addons/backbutton/ $(GC_DIR)/addons/backbutton

$(PLUGINS_DIR)/billing/billing.js:
	basil install billing

$(PLUGINS_DIR)/appflood/appFlood.js:
	basil install appflood
appfloodsecretkey.txt: ~/Dropbox/possiblewhale/sheared/appfloodsecretkey.txt
	ln -s ~/Dropbox/possiblewhale/sheared/appfloodsecretkey.txt appfloodsecretkey.txt

androidstorepass.txt: ~/Dropbox/possiblewhale/androidstorepass.txt
	ln -s ~/Dropbox/possiblewhale/androidstorepass.txt androidstorepass.txt
possiblewhale.keystore: ~/Dropbox/possiblewhale/possiblewhale.keystore
	ln -s ~/Dropbox/possiblewhale/possiblewhale.keystore possiblewhale.keystore

register:
	grep -i sheared $(GC_DIR)/config.json || basil register .

clean:
	rm -vf $(APK)
	rm -vf $(LOCALCONFIG).stamp
	rm -rf $(GC_DIR)/addons/backbutton
	rm -vf $(PLUGINS_DIR)/*
	rm -vf $(GC_DIR)/config.json.stamp
	-basil clean
	rm -vf manifest.json

install: install-android

install-android: $(LATEST_APK)
	adb install -r $^

clear-data-android:
	adb shell pm clear $(APP_DOMAIN)

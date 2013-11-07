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

else ifeq ($(BUILD),billingtest-android)
RELEASE_KEY =       androidstorepass.txt possiblewhale.keystore
APK =               build/$(BUILD_COMMAND)/native-android/shearedfreedebug.apk
OUTPUT =            $(APK)
APP_DOMAIN =        com.possiblewhale.shearedfreedebug

else ifeq ($(BUILD),debug-android)
BASIL_FLAGS =       --no-compress --clean
BASIL_COMMAND =     debug
APK =               build/$(BUILD_COMMAND)/native-android/shearedfreedebug.apk
OUTPUT =            $(APK)
APP_DOMAIN =        com.possiblewhale.shearedfreedebug

else ifeq ($(BUILD),ads-ios)
OUTPUT =            $(XCODEPROJ)
APP_DOMAIN =        com.possiblewhale.shearedfree

else ifeq ($(BUILD),paid-ios)
OUTPUT =            $(XCODEPROJ)

else ifeq ($(BUILD),debug-ios)
BUILD_FLAGS =       --no-compress --clean
BASIL_COMMAND =     debug
OUTPUT =            $(XCODEPROJ)
APP_DOMAIN =        com.possiblewhale.shearedfreedebug

endif

APP_DOMAIN ?=       com.possiblewhale.sheared
BASIL_COMMAND ?=    release
BASIL_FLAGS ?=      --compress --clean


JS_FILES =          $(wildcard src/*.js) $(wildcard src/*/*.js)
PNG_FILES =         $(wildcard resources/images/*.png) $(wildcard resources/icons/*.png) $(wildcard resources/splash/*.png)
MP3_FILES =         $(wildcard resources/sounds/*.mp3)
TTF_FILES =         $(wildcard resources/fonts/*.ttf)
MANIFESTS =         manifest.json

ADDON_FILES =       $(wildcard addons/*/android/*.java) $(wildcard addons/*/android/manifest.*) $(wildcard addons/*/android/*.json) $(wildcard addons/*/js/*.js)

CONF_DIR =          resources/conf
LOCALCONFIG =       $(CONF_DIR)/localconfig.json

PLUGINS_DIR =       sdk/plugins
PLUGINS =           $(PLUGINS_DIR)/backbutton/backbutton.js $(PLUGINS_DIR)/billingpw/billing.js

ALL_APK_DEPS =      $(PLUGINS) $(JS_FILES) $(PNG_FILES) $(MP3_FILES) $(TTF_FILES) $(MANIFESTS) $(ADDON_FILES)

SUBPROJECTS =       addons/backbutton

TOP_LEVEL_DEPS =	$(GC_DIR)/config.json manifest.json register $(LOCALCONFIG) $(SUBPROJECTS)


debug-android debug-ios ads-android paid-android ads-ios paid-ios billingtest-android:
	git pull
	$(MAKE) BUILD=$@ clean all


all: $(TOP_LEVEL_DEPS) $(OUTPUT)


$(APK): $(ALL_APK_DEPS)
	basil $(BASIL_COMMAND) native-android $(BASIL_FLAGS)

$(XCODEPROJ): $(ALL_APK_DEPS)
	basil $(BASIL_COMMAND) native-ios $(BASIL_FLAGS)

manifest.json: androidstorepass.txt appfloodsecretkey.txt manifest.json.in
	fab "gcbuild.generateManifest:$@,$(BUILD)"

$(PLUGINS_DIR): sdk
sdk:
	ln -s $(GC_DIR)/sdk sdk

# These shenanigans ensure that we can rebuild devkit/config.json every time without
# removing it, because we remove the stamp file instead.
$(GC_DIR)/config.json: androidstorepass.txt $(GC_DIR)/config.json.stamp $(RELEASE_KEY)
$(GC_DIR)/config.json.stamp:
	fab "gcbuild.generateConfigJSON:$(subst .stamp,,$@)"
	touch $@ && ls -l $@

# These shenanigans ensure that we can rebuild localconfig every time without
# removing it, because we remove the stamp file instead.
$(LOCALCONFIG): $(LOCALCONFIG).stamp
$(LOCALCONFIG).stamp:
	mkdir -p resources/conf/
	fab "gcbuild.generateLocalConfig:$(subst .stamp,,$@),$(BUILD)"
	touch $@ && ls -l $@

addons/backbutton:
	git clone git@github.com:PossibleWhale/backbutton.git $@
$(PLUGINS_DIR)/backbutton/backbutton.js: $(PLUGINS_DIR) $(GC_DIR)/addons/backbutton
	ln -sf $(GC_DIR)/addons/backbutton/js $(PLUGINS_DIR)/backbutton
$(GC_DIR)/addons/backbutton:
	ln -s `pwd`/addons/backbutton/ $(GC_DIR)/addons/backbutton

$(GC_DIR)/addons/billingpw:
	git clone git@github.com:PossibleWhale/billing.git $@
$(PLUGINS_DIR)/billingpw/billing.js: $(PLUGINS_DIR) $(PLUGINS_DIR)/billingpw $(GC_DIR)/addons/billingpw
$(PLUGINS_DIR)/billingpw:
	ln -s $(GC_DIR)/addons/billingpw $(PLUGINS_DIR)/.

$(PLUGINS_DIR)/appflood/appFlood.js: $(PLUGINS_DIR)
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
	rm -rf $(GC_DIR)/addons/appflood
	# rm -rf $(GC_DIR)/addons/billingpw
	rm -rf $(PLUGINS_DIR)/*
	rm -vf $(GC_DIR)/config.json.stamp
	-basil clean
	rm -vf manifest.json

install: install-android

install-android: $(LATEST_APK)
	adb install -r $(shell find build -name '*.apk' 2> /dev/null)

clear-data-android:
	adb shell pm clear $(APP_DOMAIN)

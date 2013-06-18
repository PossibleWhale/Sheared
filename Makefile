

all:
	@if [ -z $${GAMECLOSURE} ]; then \
		echo "** Set GAMECLOSURE as the path to the sdk in your environment" 1>&2; \
		false; \
	fi
	ln -s $${GAMECLOSURE}/sdk sdk

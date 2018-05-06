#include <stdio.h>
#include <stdlib.h>

const char* tags[] = {
	"ap2/product-id",
	"ap2/eui",
	"ap2/device-id",
	"ap2/vender-id",
	"ap2/cdone",
	"ap2/reset",
	"ap2/hw-version",
	"ap2/creset",
	"capability/adc",
	"capability/din",
	"device-id",
	"mac-eth",
	"uuid",
	"vender-id"
};

int main(void) {
	int i = 0;
	char cmd[64];
	unsigned int len = sizeof(tags)/sizeof(tags[0]);
	for(i=0; i<len; i++){
		printf("%s: ", tags[i]);
		sprintf(cmd, "mts-io-sysfs show %s", tags[i]);
		system(cmd);
	}
	return 0;
}

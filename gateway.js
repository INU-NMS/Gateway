const util = require('util');
const cp = require('child_process');
const Tail = require('tail').Tail;

// retrieve the gateway's eui
var gw_eui;
cp.exec('mts-io-sysfs show ap2/eui', function(err, stdout, stderr) {
	gw_eui = stdout.replace(/\n/g, '');
});

const mqtt = require('mqtt').connect('mqtt://localhost');
mqtt.on('connect', function() {
	str = util.format('running service on the gateway(%s)', gw_eui);
	console.log(str);
	mqtt.subscribe('gateway/req/+');
	mqtt.subscribe(util.format('gateway/%s/req/+', gw_eui));

	mqtt.on('message', function(topic, payload) {
		console.log(topic, String(payload));
		if(topic === 'gateway/req/list') list();
	});
});

function list() {
	cp.exec('lora-query -n', function(err, stdout, stderr) {
		if(mqtt.connected) {
			mqtt.publish(util.format('gateway/%s/res/list', gw_eui), stdout);
			console.log(stdout);
			return;
		} 
		console.log('not connected to the mqtt broker');
	});
}

const tail = new Tail('/var/log/lora-network-server.log');
tail.on('line', function(data) {
	// send this log via mqtt
	if(mqtt.connected) {
		mqtt.publish(util.format('gateway/%s/log', gw_eui), data);
		return;
	}
});

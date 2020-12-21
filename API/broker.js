
const{
    mqtt = require('mqtt'),
    MQTT_HOST = 'localhost',
    TEMP_DEVICE_COUNT = 3,
} = process.env

//Broker Client
const client = mqtt.connect(`mqtt://${MQTT_HOST}`);

//Broker Topics
const topics_list=[...Array(TEMP_DEVICE_COUNT).keys()].map(i => `site-a/data/dummy-temp-${i + 1}/temp`)

//Broker Client Subcribe on the topics
client.subscribe(topics_list,{qos:1});

//Publish the topic to another channel
client.on('message',function(topic, message){
    console.log("message is "+ message);
    console.log("topic is "+ topic+"\n");
    client.publish(
        topic+"/module",
        message,
    );
});

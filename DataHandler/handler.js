//Influx DB
const Influx = require( 'influx' )

const {
    mqtt = require( 'mqtt' ),
    MQTT_HOST = 'localhost',
    TEMP_DEVICE_COUNT = 3,
} = process.env

//Connect to influx DB
const influx = new Influx.InfluxDB( {
    host: 'localhost',
    database: 'temperature_db',

    schema: [
        {
            measurement: 'Situation',
            fields: {
                temperature: Influx.FieldType.FLOAT,
                humidity: Influx.FieldType.FLOAT
            },
            tags: ['Sensor']
        }
    ]
} )

//Module Client
const client = mqtt.connect( `mqtt://${MQTT_HOST}` );

//Topic list for Module Client
const topics_list = [...Array( TEMP_DEVICE_COUNT ).keys()].map( i => `site-a/data/dummy-temp-${i + 1}/temp/module` )

//Subscribe Module Topics from the list
client.subscribe( topics_list, {qos: 1} );

//Create Database
influx.getDatabaseNames()
    .then(names => {
        if (!names.includes('temperature_db')) {
            return influx.createDatabase('temperature_db');
        }
    })
    .catch(() => {
        console.error(`Error creating Influx database!`);
    })

//Firebase real time database
const admin = require("firebase-admin");

// Fetch the service account key JSON file contents
const serviceAccount = require("/Users/zykhor/Desktop/Tanand/Sensor-Dashboard/DataHandler/newagent-182e8-firebase-adminsdk-kus6w-107bc79c70.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://newagent-182e8.firebaseio.com/"
});

const db = admin.database();
const ref = db.ref("User/Sensor");

//Turn on the client to received the message from topic channel
client.on( 'message', function (topic, message) {

    //Write the data received from channel into influx db
    const device = JSON.parse( message.toString() );
    influx.writePoints( [
        {
            measurement: 'Situation',
            tags: {Sensor: device.deviceId},
            fields: {temperature: device.temperature, humidity: device.humidity},
        }
    ] ).catch( err => {
        console.error( `Error saving data to InfluxDB! ${err.stack}` )
    } );

    //Write the data received from channel into firebase real time database
    ref.child(device.deviceId).set({
        temperature: device.temperature,
        humidity: device.humidity
    })
});

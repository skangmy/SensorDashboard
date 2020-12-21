const Influx = require( 'influx' )
const express = require( 'express' )
const http = require('http')
const app = express()

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
            tags: [
                'Sensor'
            ]
        }
    ]
} )

http.createServer(app).listen(3000, function () {
    console.log('Listening to port 3000')
})

app.use( require( 'cors' )() );

app.get( '/:device/:limit', function (req, res) {
    influx.query( `
      select * from Situation
      where Sensor = '${req.params.device}'
      order by time desc
      limit ${req.params.limit}
    ` ).then( object => {
        res.json(object)
    } ).catch( err => {
        res.status( 500 ).send( err.stack )
    } )
} )




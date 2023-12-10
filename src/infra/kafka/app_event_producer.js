const { Kafka, CompressionTypes, logLevel } = require('kafkajs')
const ip = require('ip')

module.exports = ({ config, logger, constants }) => {

    const { errorTypesKafka, signalTrapsKafka } = constants
    const host = config.KAFKA_HOST_IP || ip.address()

    const kafka = new Kafka({
        logLevel: logLevel.DEBUG,
        brokers: [`${host}:9092`],
        clientId: 'app-media-service-producer',
    })

    const producer = kafka.producer()

    const init = async () => {
        try {
            await producer.connect().catch(e => console.error(`[app-media-service-producer] ${e.message}`, e),)
        } catch (e) {
            logger.error('Unable to publish app event producer :  ', e)
            process.exit(0)
        }
        handleSignals()
    }

    const handleSignals = async () => {
        errorTypesKafka.forEach(type => {
            process.on(type, async e => {
                try {
                    console.log(`process.on ${type}`)
                    console.error(e)
                    await producer.disconnect()
                    process.exit(0)
                } catch (_) {
                    process.exit(1)
                }
            })
        })
        signalTrapsKafka.forEach(type => {
            process.once(type, async () => {
                try {
                    await producer.disconnect()
                } finally {
                    process.kill(process.pid, type)
                }
            })
        })
    }
    
    const publishEvent = async (eventName, message) => {
        // Before publishing event,  we can verify in house listner if present or not
        // And also we can send multiple topics for mulitiple listner
        return producer
            .send({ topic: eventName, compression: CompressionTypes.GZIP, messages: [{ key: eventName, value: JSON.stringify(message) }] })
            .catch(e => console.error(`[app-media-service-producer] ${e.message}`, e))
    }

    return { init, publishEvent }
}

const { Kafka, logLevel } = require('kafkajs')
const ip = require('ip')

module.exports = ({ config, logger, constants }) => {

    const { errorTypesKafka, signalTrapsKafka } = constants
    const host = config.KAFKA_HOST_IP || ip.address()

    const kafka = new Kafka({
        logLevel: logLevel.INFO,
        brokers: [`${host}:9092`],
        clientId: 'app-saathi-service-consumer',
    })

    const consumer = kafka.consumer({ groupId: config.KAFKA_GROUP_ID })

    const handleSignals = async () => {
        errorTypesKafka.forEach(type => {
            process.on(type, async e => {
                try {
                    console.log(`process.on ${type}`)
                    console.error(e)
                    await consumer.disconnect()
                    process.exit(0)
                } catch (_) {
                    process.exit(1)
                }
            })
        })
        signalTrapsKafka.forEach(type => {
            process.once(type, async () => {
                try {
                    await consumer.disconnect()
                } finally {
                    process.kill(process.pid, type)
                }
            })
        })
    }
    const listenerConfig = {}
    const subscribeEvent = (eventName, listeners) => {
        listenerConfig[eventName] = listeners
    }

    const init = async () => {

        if ( !config.KAFKA_TOPIC_SUBSCRIBER ) { return } 
        try {
            await consumer.connect().catch(e => console.error(`[app-saathi-service-consumer] ${e.message}`, e))
            for (const [key, value] of Object.entries(listenerConfig)) {
                await consumer.subscribe({ topic: key, fromBeginning: true })
            }
        } catch (e) {
            logger.error('Unable to subscribe app event consumer :  ', e)
            process.exit(0)
        }

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const eventName = `${message.key}`, value = `${message.value}`
                logger.info(`[app-saathi-service-consumer] : ${topic} : ${value}`)

                if (listenerConfig[eventName]) {
                    for (let i in listenerConfig[eventName]) {
                        const listnerConfig = listenerConfig[eventName][i]
                        try {
                            await listnerConfig.listener[`handleEvent${eventName}`](eventName, JSON.parse(value))
                        } catch (e) {
                            logger.error('[app-saathi-service-consumer] : ${topic} : ${value} error :  ', e)
                        }
                    }
                }
            }
        })

        handleSignals()
    }

    return { init, subscribeEvent }

}

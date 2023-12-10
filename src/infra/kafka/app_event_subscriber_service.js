const { subscribeEvent } = require('./app_event_consumer')
import { define } from '../../containerHelper'

module.exports =  define('appEventSubscriberService', ({ constants, appEventConsumer, postContentAnalysisService }) => {

    const init = () => {
      appEventConsumer.subscribeEvent(constants.events.postContent.postContentChanged, [
            {
              listener: postContentAnalysisService,
              subscriberServiceName: 'postContentAnalysisService',
              sync: true
            },
          ])
    }

    return { init }
})

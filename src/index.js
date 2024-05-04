import { resolve } from './container'

const environment = process.env.NODE_ENV || 'development'
if (environment.indexOf('stage') >= 0 || environment.indexOf('production') >= 0) {
}

const app = resolve('app')

app
  .start()
  .catch((error) => {
    app.logger.error(error.stack)
    process.exit()
  })

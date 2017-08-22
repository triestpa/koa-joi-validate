const joi = require('joi')

function validate (input, label, schema) {
  // Return function that validates a provided Koa context object.
  return (ctx) => {
    if (schema) { // Skip validation if no schema is provided
      const { error, value } = joi.validate(input, schema)
      if (error) {
        // Throw error if validation failed
        throw new Error(`Invalid ${label} - ${error.message}`)
      }
    }
  }
}

function validateRequest (validationObj) {
  return (ctx, next) => {
    try {
      validate(ctx.query, 'Headers', validationObj.headers)
      validate(ctx.params, 'URL Parameters', validationObj.params)
      validate(ctx.query, 'URL Query', validationObj.query)
      validate(ctx.body, 'Request Body', validationObj.body)
      return next()
    } catch (err) {
      ctx.throw(400, err.message)
    }
  }
}

module.exports = validateRequest
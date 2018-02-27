'use strict'

const t = require('tap')
const test = t.test
const Fastify = require('fastify')

test('should return an html document', t => {
  t.plan(3)

  const fastify = Fastify()
  fastify
    .register(require('./index'))
    .after(() => {
      fastify.next('/hello')
    })

  fastify.inject({
    url: '/hello',
    method: 'GET'
  }, (err, res) => {
    t.error(err)
    t.equal(res.statusCode, 200)
    t.equal(res.headers['content-type'], 'text/html; charset=utf-8')
  })

  fastify.close()
})

test('should support different methods', t => {
  t.plan(3)

  const fastify = Fastify()
  fastify
    .register(require('./index'))
    .after(() => {
      fastify.next('/hello', { method: 'options' })
    })

  fastify.inject({
    url: '/hello',
    method: 'OPTIONS'
  }, (err, res) => {
    t.error(err)
    t.equal(res.statusCode, 200)
    t.equal(res.headers['content-type'], 'text/html; charset=utf-8')
  })

  fastify.close()
})

test('should support a custom handler', t => {
  t.plan(3)

  const fastify = Fastify()
  fastify
    .register(require('./index'))
    .after(() => {
      fastify.next('/hello', (app, req, reply) => {
        app.render(req.req, reply.res, '/hello', req.query, {})
      })
    })

  fastify.inject({
    url: '/hello',
    method: 'GET'
  }, (err, res) => {
    t.error(err)
    t.equal(res.statusCode, 200)
    t.equal(res.headers['content-type'], 'text/html; charset=utf-8')
  })

  fastify.close()
})

test('should return 404 on undefined route', t => {
  t.plan(2)

  const fastify = Fastify()
  fastify
    .register(require('./index'))
    .after(() => {
      fastify.next('/hello')
    })

  fastify.inject({
    url: '/test',
    method: 'GET'
  }, (err, res) => {
    t.error(err)
    t.equal(res.statusCode, 404)
  })

  fastify.close()
})

test('should throw if path is not a string', t => {
  t.plan(2)

  const fastify = Fastify()
  fastify
    .register(require('./index'))
    .ready(err => {
      t.error(err)
      try {
        fastify.next(null)
        t.fail()
      } catch (e) {
        t.equal(e.message, 'path must be a string')
      }
    })

  fastify.close()
})

test('should throw if opts.method is not a string', t => {
  t.plan(2)

  const fastify = Fastify()
  fastify
    .register(require('./index'))
    .ready(err => {
      t.error(err)
      try {
        fastify.next('/hello', { method: 1 })
        t.fail()
      } catch (e) {
        t.equal(e.message, 'options.method must be a string')
      }
    })

  fastify.close()
})

test('should throw if opts.schema is not an object', t => {
  t.plan(2)

  const fastify = Fastify()
  fastify
    .register(require('./index'))
    .ready(err => {
      t.error(err)
      try {
        fastify.next('/hello', { schema: 1 })
        t.fail()
      } catch (e) {
        t.equal(e.message, 'options.schema must be an object')
      }
    })
})

test('should throw if opts.next is not an object', t => {
  t.plan(2)

  const fastify = Fastify()
  fastify
    .register(require('./index'))
    .ready(err => {
      t.error(err)
      try {
        fastify.next('/hello', { next: 1 })
        t.fail()
      } catch (e) {
        t.equal(e.message, 'options.next must be an object')
      }
    })

  fastify.close()
})

test('should throw if callback is not a function', t => {
  t.plan(2)

  const fastify = Fastify()
  fastify
    .register(require('./index'))
    .ready(err => {
      t.error(err)
      try {
        fastify.next('/hello', {}, 1)
        t.fail()
      } catch (e) {
        t.equal(e.message, 'callback must be a function')
      }
    })

  fastify.close()
})

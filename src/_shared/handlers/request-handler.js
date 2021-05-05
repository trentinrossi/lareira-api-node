const httpStatus = require('http-status');

class RequestHandler {
  onBadRequest(body, ctx) {
    ctx.status = httpStatus.BAD_REQUEST;
    ctx.body =
      typeof body === 'string'
        ? { message: body, status: httpStatus.BAD_REQUEST }
        : Object.assign(body, { status: httpStatus.BAD_REQUEST });
  }

  onError(message, errors, res) {
    return res.status(httpStatus.BAD_REQUEST).json({
      status: httpStatus.BAD_REQUEST,
      message,
      errors,
    });
  }

  onConflict(message, errors, ctx) {
    ctx.status = httpStatus.CONFLICT;
    ctx.body = {
      message,
      errors,
    };
  }

  onNoContent(ctx) {
    ctx.status = httpStatus.NO_CONTENT;
    ctx.body = '';
  }

  onSuccess(meta, data, res) {
    const body = {
      meta,
      data,
    };

    return res.status(httpStatus.OK).json(body);
  }

  onCreated(data = {}, res) {    
    return res.status(httpStatus.CREATED).json(data);
  }

  onUpdated(ctx, data = {}) {
    ctx.status = httpStatus.CREATED;
    ctx.body = data;
  }

  onUnauthorized(ctx, message) {
    ctx.status = 401;
    ctx.body = {
      message,
    };
  }
}

module.exports = new RequestHandler();

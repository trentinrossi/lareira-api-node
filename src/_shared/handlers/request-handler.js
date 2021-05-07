const httpStatus = require('http-status');

class RequestHandler {
  onBadRequest(body, res) {
    body.status = httpStatus.BAD_REQUEST;
    body =
      typeof body === 'string'
        ? { message: body, status: httpStatus.BAD_REQUEST }
        : Object.assign(body, { status: httpStatus.BAD_REQUEST });
    return res.status(httpStatus.BAD_REQUEST).json(body);
  }

  onError(message, errors, res) {
    return res.status(httpStatus.BAD_REQUEST).json({
      status: httpStatus.BAD_REQUEST,
      message,
      errors,
    });
  }

  onConflict(message, errors, res) {
    const body = {
      message,
      errors,
    };

    return res.status(httpStatus.CONFLICT).json(body);
  }

  onNoContent(res) {
    return res.status(httpStatus.NO_CONTENT).json({});
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

  onUpdated(data = {}, res) {
    return res.status(httpStatus.CREATED).json(data);
  }

  onUnauthorized(message, res) {
    const body = {
      message,
    };

    return res.status(401).json(body);
  }
}

module.exports = new RequestHandler();

class PagingHelper {
  build(query = {}) {
    const sort = {};
    const page = parseInt(query.skip, 10) + 1 || 1;
    const limit = parseInt(query.limit, 10) || 20;
    let skip = parseInt(query.skip, 10) * limit;
    skip = skip < 0 ? 0 : skip;

    Object.keys(query).forEach((prop) => {
      if (prop.match('_sort_')) {
        sort[prop.replace('_sort_', '')] = query[prop] === 'desc' ? -1 : 1;
      }
    });

    return {
      page,
      limit,
      skip,
      sort
    };
  }

  resolve(meta, total) {
    let pages = parseInt(total / meta.limit, 10);
    if ((total % 2) > 0) {
      pages += 1;
    }

    if (pages === 0) pages = 1;

    const previous = meta.skip > 0;
    const next = total > (meta.page * meta.limit);
    
    return {
      currentPage: meta.page,
      itemsPerPage: meta.limit,
      next,
      pages,
      previous,
      skip: meta.page - 1,
      totalItems: total
    };
  }

  resolveAllActivities(meta) {
    const previous = meta.skip > 0;

    return {
      currentPage: meta.page,
      itemsPerPage: meta.limit,
      previous,
      skip: meta.page - 1,
    };
  }
}

module.exports = new PagingHelper();

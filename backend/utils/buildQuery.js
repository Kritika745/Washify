export function buildFilters(query) {
  const { serviceType, status, carType, startDate, endDate, includeDeleted, addOn, minRating } = query

  const filter = { isDeleted: false }

  if (includeDeleted === "true") {
    delete filter.isDeleted
  }

  if (serviceType) filter.serviceType = serviceType
  if (status) filter.status = status
  if (carType) filter["carDetails.type"] = carType
  if (addOn) filter.addOns = { $in: [addOn] }
  if (minRating) filter.rating = { $gte: Number(minRating) }

  if (startDate || endDate) {
    filter.date = {}
    if (startDate) filter.date.$gte = new Date(startDate)
    if (endDate) filter.date.$lte = new Date(endDate)
  }

  return filter
}

export function buildSort(sortBy, order = "desc") {
  const sort = {}
  const dir = order === "asc" ? 1 : -1
  switch (sortBy) {
    case "date":
      sort.date = dir
      break
    case "price":
      sort.price = dir
      break
    case "duration":
      sort.duration = dir
      break
    case "status":
      sort.status = dir
      break
    case "createdAt":
      sort.createdAt = dir
      break
    default:
      sort.createdAt = -1
  }
  return sort
}


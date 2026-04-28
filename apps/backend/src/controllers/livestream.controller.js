/* eslint-disable no-unused-vars */
import ApiSuccess from '#core/success.response.js'
import livestreamService from '#services/livestream.service.js'
import { StatusCodes } from 'http-status-codes'

const createLiveSession = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Creatue live session successfully!',
    metadata: await livestreamService.createLiveSession({ userId: req.user.userId, reqBody: req.body, shopId: req.user.shopId })
  }).send(res)
}
const startLive = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Start live session successfully!',
    metadata: await livestreamService.startLive({ userId: req.user.userId, liveId: req.params.liveId })
  }).send(res)
}
const endLive = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'End live session successfully!',
    metadata: await livestreamService.endLive({ userId: req.user.userId, liveId: req.params.liveId })
  }).send(res)
}
const joinLive = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Join live session successfully!',
    metadata: await livestreamService.joinLive({ userId: req.user.userId, liveId: req.params.liveId })
  }).send(res)
}
const getActiveSessions = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'get live session successfully!',
    metadata: await livestreamService.getActiveSessions(req.query)
  }).send(res)
}
const pinProduct = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'pin product successfully!',
    metadata: await livestreamService.pinProduct({ userId: req.user.userId, liveId: req.params.liveId, productId: req.body })
  }).send(res)
}
const unpinProduct = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'unpun product successfully!',
    metadata: await livestreamService.unpinProduct({ userId: req.user.userId, liveId: req.params.liveId })
  }).send(res)
}
const addProductToLiveSession = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Add product to Live successfully!',
    metadata: await livestreamService.addProductToLiveSession({ shopId: req.user.shopId, liveId: req.params.liveId, products: req.body })
  }).send(res)
}
const updateLiveSession = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Update Live successfully!',
    metadata: await livestreamService.updateLiveSession({ liveId: req.params.liveId, reqBody: req.body })
  }).send(res)
}
const cancelLiveSession = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Cancel Live successfully!',
    metadata: await livestreamService.cancelLiveSession({ liveId: req.params.liveId })
  }).send(res)
}
const getHistoryLiveByShop = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Get history Live successfully!',
    metadata: await livestreamService.getHistoryLiveByShop({ shopId: req.user.shopId, ...req.query })
  }).send(res)
}

export default {
  createLiveSession,
  startLive,
  endLive,
  joinLive,
  getActiveSessions,
  pinProduct,
  unpinProduct,
  addProductToLiveSession,
  getHistoryLiveByShop,
  updateLiveSession,
  cancelLiveSession
}
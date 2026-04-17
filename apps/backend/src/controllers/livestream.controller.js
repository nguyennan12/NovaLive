/* eslint-disable no-unused-vars */
import ApiSuccess from '#core/success.response.js'
import livestreamService from '#services/livestream.service.js'
import { StatusCodes } from 'http-status-codes'

const createLiveSession = async (req, res, next) => {
  new ApiSuccess({
    statusCode: StatusCodes.OK,
    message: 'Creatue live session successfully!',
    metadata: await livestreamService.createLiveSession({ userId: req.user.userId, reqBody: req.body })
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

export default {
  createLiveSession,
  startLive,
  endLive,
  joinLive,
  getActiveSessions,
  pinProduct,
  unpinProduct
}
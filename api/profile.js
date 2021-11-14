import { request } from '@/plugins/request'

// 关注用户
export const followUser = username => {
  return request({
    method: 'POST',
    url: `/api/profiles/${username}/follow`
  })
}

// 取消关注用户
export const unfollowUser = username => {
  return request({
    method: 'DELETE',
    url: `/api/profiles/${username}/follow`
  })
}

// 获取用户档案
export const getProfile = username => {
  return request({
    method: 'GET',
    url: `/api/profiles/${username}`
  })
}
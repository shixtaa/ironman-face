import request from '../axios'

// 获取人脸库样本用户数
export function getRegisterStatic() {
  return request({
    url: '/api/facetest/GetRegisterStatic',
    method: 'get'
  })
}

// 上传人脸照片调试
export function testFaceDetect(data) {
  return request({
    url: '/api/facetest/TestFaceDetect',
    method: 'post',
    data
  })
}

// 注册人脸
export function registerFace(data) {
  return request({
    url: '/api/facetest/RegisterFace',
    method: 'post',
    data
  })
}

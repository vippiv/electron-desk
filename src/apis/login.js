import request from '@/utils/request'

export function fetchLogin(query) {
    return request({
        url: '/vue-element-admin/login',
        method: 'get',
        params: query
    })
}
import Suggest from '@/pages/suggest'
import Advisory from '@/pages/advisory'
import Recording from '@/pages/recording'
import Knowledge from '@/pages/knowledge'

export default [
    {
        path: "/suggest",
        name: '用药建议',
        icon: 'icon-medisine',
        components: {
            contents: Suggest
        }
    },
    {
        path: "/advisory",
        name: '咨询明细',
        icon: 'icon-detail',
        components: {
            contents: Advisory
        }
    },
    {
        path: "/recording",
        name: '会诊记录',
        icon: 'icon-diagnosis',
        components: {
            contents: Recording
        }
    },
    {
        path: "/knowledge",
        name: '知识库',
        icon: 'icon-diagnosis',
        components: {
            contents: Knowledge
        }
    }
]
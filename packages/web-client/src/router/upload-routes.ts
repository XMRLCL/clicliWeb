import type { RouteRecordRaw } from "vue-router";

export const uploadRoutes: RouteRecordRaw = {
    path: '/upload',
    name: 'Upload',
    component: () => import("../views/upload/Index.vue"),
    redirect: "/upload/video",
    children: [
        {
            path: '/upload/video/:vid?',
            name: 'contribute',
            meta: { auth: true },
            component: () => import("../views/upload/uploadvideo/Index.vue"),
        },
        {
            path: '/upload/live/:vid?',
            name: 'UploadVideo',
            meta: { auth: true },
            component: () => import("../views/upload/upload-video/Index.vue"),
        },
        {
            path: '/upload/video/manage',
            name: 'VideoManage',
            meta: { auth: true },
            component: () => import("../views/upload/video-manage/Index.vue"),
        },
        {
            path: '/upload/comment/manage',
            name: 'CommentManage',
            meta: { auth: true },
            component: () => import("../views/upload/comment-manage/Index.vue"),
        },
        {
            path: '/upload/comment/article',
            name: 'ArticleManage',
            meta: { auth: true },
            component: () => import("../views/upload/article-manage/Index.vue"),
        },

    ]
}

const title = "clicli";
const https = false;
const domain = "";
const mobile = "/mobile/";
const icp = "陕ICP备2022004199号-2";
const security = "公网安备信息"

//上传文件大小限制，需要先修改后端大小限制
const maxImgSize = 5;//上传图片最大大小(单位M)
const maxVideoSize = 500;//上传视频最大大小(单位M)

export const globalConfig = {
    title: title,
    https: https,
    domain: domain,
    mobile: mobile,
    icp: icp,
    security: security,
    maxImgSize: maxImgSize,
    maxVideoSize: maxVideoSize,
}
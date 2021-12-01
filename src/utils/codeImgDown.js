import html2canvas from "html2canvas";

function downloadFile(content, fileName) { //下载base64图片
    var base64ToBlob = function (code) {
        let parts = code.split(';base64,');
        let contentType = parts[0].split(':')[1];
        let raw = window.atob(parts[1]);
        let rawLength = raw.length;
        let uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }
        return new Blob([uInt8Array], {
            type: contentType
        });
    };
    let aLink = document.createElement('a');
    let blob = base64ToBlob(content); //new Blob([content]);
    let evt = document.createEvent("HTMLEvents");
    evt.initEvent("click", true, true); //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);
    aLink.click();
}
export async function codeImgDown(element,fileName) {
    // 生成快照
    const convertToImage = (container, options = {}) => {
        const ops = {
            // scale:1,//设置放大倍数
            // width,// 传入节点原始宽高
            // height,
            useCORS: true,
            allowTaint: false,
            ...options
        };

        return html2canvas(container, ops).then(canvas => {
            // 返回图片的二进制数据
            return canvas.toDataURL("image/png");
        });
    }

    // 调用函数，取到截图的二进制数据，对图片进行处理（保存本地、展示等）
    downloadFile(await convertToImage(element),fileName)
}
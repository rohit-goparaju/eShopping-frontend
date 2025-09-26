export function base64ToBlob(base64, mimeType){
    if(base64 && mimeType){
        const byteString = atob(base64);
        const byteNumbers = new Array(byteString.length);
        for(let i = 0; i < byteString.length; i++){
            byteNumbers[i] = byteString.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], {type : mimeType});
    }else
        return null;
}

export function base64ToFile(base64, mimeType, fileName){
    if(base64 && mimeType && fileName)
        return new File([base64ToBlob(base64, mimeType)], fileName, {type: mimeType});
    else 
        return null;
}

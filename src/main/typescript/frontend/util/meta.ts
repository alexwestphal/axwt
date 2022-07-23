/*
 * Copyright (c) 2019-2022, OnPoint Digital, Inc. All rights reserved
 */

export const getMeta = (metaName: String): string | null => {
    const metas = document.getElementsByTagName('meta')
    for(let i=0; i < metas.length; i++) {
        if(metas[i].getAttribute("name") == metaName) {
            return metas[i].getAttribute("content")
        }
    }
    return null
}

export interface HtmlString {
    __html: string
}


export const stripHtml = (htmlString: HtmlString): string => {

    let tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlString.__html

    return tempDiv.innerText
}

export default HtmlString
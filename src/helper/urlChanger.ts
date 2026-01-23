import { APPURL, IMAGE_BASE_URL } from "../utils/config"

export const imageurl = (img: string) => {
  if (!img) return ''; // handle empty string
  console.log(img)

  // Check if img starts with http:// or https://
  if (img.startsWith('http://') || img.startsWith('https://')) {
    console.log('returning ', img )
    return img;
  }

  // Otherwise, prepend base URL
  return `${IMAGE_BASE_URL}${img}`;
}


export const createQrUrl = (token:string)=>{
return `${APPURL}?key=${token}`
}
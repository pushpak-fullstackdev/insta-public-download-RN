import axios from 'axios';
import cheerio from 'cheerio';
export const getData = (url) => {
    console.log('Url', url);
    return new Promise((resolve, reject) => {
        fetch(url)
        .then(response => {
            response.text().then(text => {
                const loaded = cheerio.load(text);
                const imageUrl = loaded('meta[property="og:image"]').attr('content');
                const videoUrl = loaded('meta[property="og:video"]').attr('content');
                const title = loaded('meta[property="og:title"]').attr('content');
                resolve({
                    url: videoUrl ? videoUrl : imageUrl, 
                    isVideo: videoUrl ? true : false,
                    title
                })
            })
        }).catch(error => {
            reject(error);
        })
    })
}
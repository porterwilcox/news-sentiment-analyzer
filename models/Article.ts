export class Article {
    source: string;
    title: string;
    url: string;
    urlToImage: string;
    publishedAt: string;

    constructor(article: any) {
        this.source = article['source']['name'];
        this.title = article['title'].substring(0, article['title'].indexOf('-')).trim();
        this.url = article['url'];
        this.urlToImage = article['urlToImage'];
        this.publishedAt = article['publishedAt'];
    }

    get pojo() {
        return {
            source: this.source,
            title: this.title,
            url: this.url,
            urlToImage: this.urlToImage,
            publishedAt: this.publishedAt
        }
    }
}
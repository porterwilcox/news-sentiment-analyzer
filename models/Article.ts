export class Article {
    source: string;
    title: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    sentiment: string;

    constructor(source: string, title: string, url: string, urlToImage: string, publishedAt: string, sentiment: string = '') {
        this.source = source;
        this.title = title;
        this.url = url;
        this.urlToImage = urlToImage;
        this.publishedAt = publishedAt;
        this.sentiment = sentiment;
    }

    static fromApiData(data: any) : Article {
        let title = data['title'];
        if (title.includes(' - ')) {
            title = data['title'].substring(0, data['title'].indexOf('-')).trim();
        }
        return new Article(
            data['source']['name'],
            title,
            data['url'],
            data['urlToImage'],
            data['publishedAt']
        );
    }

    get pojo() {
        return {
            source: this.source,
            title: this.title,
            url: this.url,
            urlToImage: this.urlToImage,
            publishedAt: this.publishedAt,
            sentiment: this.sentiment
        }
    }
}
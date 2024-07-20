export class ArticleSentimentAnalysis {
    sentiment: string;
    severity: number;

    constructor(sentiment: string, severity: number) {
        this.sentiment = sentiment;
        this.severity = severity;
    }
}
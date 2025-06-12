export type CurrencyResponse = {
    amount: number;
    base: string;
    date: string;
    rates: {
        [key: string]: number;
    };
}
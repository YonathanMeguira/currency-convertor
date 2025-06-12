export type CurrencySwitchOperation = {
    from: Currencies,
    to: Currencies,
    amount: number,
    date?: Date
}

export enum Currencies {
    EUR = 'EUR',
    USD = 'USD',
    ILS = 'ILS'
}
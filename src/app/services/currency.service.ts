import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CurrencySwitchOperation } from "../models/currency";
import { CurrencyResponse } from "../models/currency-response";
import { map, tap } from "rxjs";
import { StateService } from "./state.service";

@Injectable({
    providedIn: 'root'
})
export class CurrencyService {

    private state = inject(StateService);
    private http = inject(HttpClient);

    convert({ from, to, amount }: CurrencySwitchOperation) {

        const getResult = (query: CurrencyResponse) => query.rates[to] * amount;

        return this.http.get<CurrencyResponse>(`https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}`)
            .pipe(
                tap((response) => this.state.addToHistory({
                    from, to,
                    amount,
                    date: Date.now(),
                    result: getResult(response)
                })),
                map((response) => getResult(response))
            );
    }

    getHistoryForPeriod(numOfDays: number, from: string, to: string) {
        const startDate = this.formatDate(numOfDays);
        const endDate = this.formatDate(0);
        const url = `https://api.frankfurter.dev/v1/${startDate}..${endDate}`;

        return this.http.get<{ rates: any[] }>(url)
            .pipe(
                tap(response => console.log(response)),
                map((response) => {
                    return Object.entries(response.rates).map(([date, rates]) => ({
                        date,
                        rates: [rates[from], rates[to]]
                    }));
                })
            );
    }

    private formatDate(numberOfDays: number): string {
        const date = new Date();
        date.setDate(date.getDate() - numberOfDays);
        return date.toISOString().split('T')[0];
    }



}
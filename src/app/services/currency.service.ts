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

}
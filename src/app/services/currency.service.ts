import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CurrencySwitchOperation } from "../models/currency.model";

@Injectable({
    providedIn: 'root'
})
export class CurrencyService {

    private http = inject(HttpClient);

    convert(operation: CurrencySwitchOperation) {
        // here we return directly the result to the consumer,
        //  in a more complex app, we would instead here append the data to some store ((tap) for instance), 
        // the components would be consuming data from the store instead
        return this.http.post<number>('http://localhost:3000/convert', operation);
    }

}
import { Injectable } from "@angular/core";
import { BehaviorSubject, map } from "rxjs";
import { CurrencySwitchOperation } from "../models/currency";

type State = {
    history: CurrencySwitchOperation[]
}

@Injectable({
    providedIn: 'root'
})
export class StateService {
    private state = new BehaviorSubject<State>({
        history: []
    });

    getHistory() {
        return this.state.pipe(
            map((state) => state.history)
        );
    }

    addToHistory(operation: CurrencySwitchOperation) {
        this.state.next({
            history: [...this.state.value.history, operation]
        });
    }

}
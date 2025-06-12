import { Component, inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Currencies, CurrencySwitchOperation } from '../../models/currency.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CurrencyService } from '../../services/currency.service';
import { Subject, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-convert',
  imports: [
    ReactiveFormsModule, 
    CommonModule, 
    MatFormFieldModule, 
    MatOptionModule, 
    MatSelectModule, 
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './convert.component.html',
  styleUrl: './convert.component.scss'
})
export class ConvertComponent implements OnDestroy {
  currencies = Currencies;
  private currencyService = inject(CurrencyService);
  private snackBar = inject(MatSnackBar);
  private destroy$ = new Subject<void>();
  
  result: number | null = null;
  isLoading = false;

  form = new FormGroup({
    amount: new FormControl('', [Validators.required, Validators.min(0)]),
    from: new FormControl(Currencies.USD, [Validators.required]),
    to: new FormControl(Currencies.ILS, [Validators.required]),
  });

  convert() {
    if (this.form.invalid) {
      this.snackBar.open('Please fill all fields correctly', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    const operation: CurrencySwitchOperation = {
      from: this.form.value.from as Currencies,
      to: this.form.value.to as Currencies,
      amount: Number(this.form.value.amount),
    };

    this.currencyService.convert(operation)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.result = result;
          this.isLoading = false;
        },
        error: (error) => {
          this.snackBar.open('Error converting currency: ' + error.message, 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

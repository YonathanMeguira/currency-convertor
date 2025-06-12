import { Component, inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Currencies, CurrencySwitchOperation } from '../../models/currency';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CurrencyService } from '../../services/currency.service';
import { Subject, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';



@Component({
  selector: 'app-convert',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    BaseChartDirective,
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

  // Chart configuration
  lineChartData!: ChartConfiguration['data'];

  lineChartOptions!: ChartConfiguration['options'];

  lineChartType: ChartType = 'line';

  form = new FormGroup({
    amount: new FormControl('', [Validators.required, Validators.min(0)]),
    from: new FormControl(Currencies[0].symbol, [Validators.required]),
    to: new FormControl(Currencies[1].symbol, [Validators.required]),
  });



  convert() {
    if (this.form.invalid) {
      this.snackBar.open('Please fill all fields correctly', 'Close', { duration: 3000 });
      return;
    }

    this.getHistoryForPeriod(30, this.form.value.from!, this.form.value.to!);

    this.isLoading = true;
    const operation: CurrencySwitchOperation = {
      from: this.form.value.from!,
      to: this.form.value.to!,
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

  getHistoryForPeriod(numOfDays: number, from: string, to: string) {
    this.currencyService.getHistoryForPeriod(numOfDays, from, to)
      .pipe(takeUntil(this.destroy$))
      .subscribe((history) => {
        const dates = history.map(h => new Date(h.date).toLocaleDateString());
        const currencyFromRates = history.map(h => h.rates[0]);
        const currencyToRates = history.map(h => h.rates[1]);
        this.loadChart({ dates, currencyFromRates, currencyToRates, from, to });
      });
  }

  private loadChart(config: any) {
    this.lineChartData = {
      labels: config.dates,
      datasets: [
        {
          data: config.currencyFromRates,
          label: config.from,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
        {
          data: config.currencyToRates,
          label: config.to,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1
        }
      ]
    };
    // Chart configuration
    this.lineChartData = {
      datasets: [
        {
          data: config.currencyFromRates,
          label: config.from,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
        {
          data: config.currencyToRates,
          label: config.to,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1
        }
      ],
      labels: config.dates
    };

    this.lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: `Currency Exchange Rate History ${config.from} to ${config.to}`
        }
      },
      scales: {
        y: {
          beginAtZero: false
        }
      }
    };
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

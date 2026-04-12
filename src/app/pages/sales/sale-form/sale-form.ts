import { inject, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BrnDialogRef } from '@spartan-ng/brain/dialog';
import {
  HlmDialogFooter,
  HlmDialogHeader,
  HlmDialogTitle,
} from '@spartan-ng/helm/dialog';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerPlus, tablerTrash } from '@ng-icons/tabler-icons';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { CrudService } from '../../../services/crud.service';
import { ToolsService } from '../../../services/tools.service';
import { AbstractForm } from '../../../shared/abstract-form';
import { CustomerResponse } from '../../../types/customer.types';
import { ProductResponse } from '../../../types/product.types';
import { SalesRequest, SalesResponse } from '../../../types/sales.types';

export interface SaleFormResult {
  refresh: boolean;
  sale?: SalesResponse;
}

@Component({
  selector: 'app-sale-form',
  imports: [
    FormsModule,
    HlmButton,
    HlmDialogFooter,
    HlmDialogHeader,
    HlmDialogTitle,
    HlmInputImports,
    HlmLabel,
    HlmSpinner,
    NgIcon,
    HlmIcon,
  ],
  providers: [CrudService, provideIcons({ tablerPlus, tablerTrash })],
  templateUrl: './sale-form.html',
})
export class SaleForm extends AbstractForm implements OnInit {
  private readonly dialogRef = inject(BrnDialogRef<SaleFormResult>, {
    optional: true,
  });
  private readonly cdr = inject(ChangeDetectorRef);

  protected customers: CustomerResponse[] = [];
  protected products: ProductResponse[] = [];

  constructor(service: CrudService, tools: ToolsService) {
    super(service, tools);
    this.service.path = 'sales';
    this.dados = this.getEmptySale();
  }

  ngOnInit(): void {
    this.loadingData = true;
    void this.loadOptions();
  }

  addItem(product: ProductResponse): void {
    const existing = this.dados.items.find((i: any) => i.productId === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      this.dados.items.push({ productId: product.id, quantity: 1 });
    }
  }

  removeItem(productId: string): void {
    this.dados.items = this.dados.items.filter((i: any) => i.productId !== productId);
  }

  getItemQuantity(productId: string): number {
    return this.dados.items.find((i: any) => i.productId === productId)?.quantity ?? 0;
  }

  getProductName(productId: string): string {
    return this.products.find(p => p.id === productId)?.name ?? '';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value ?? 0);
  }

  submit(form: NgForm): void {
    if (form.invalid || this.dados.items.length === 0) {
      form.control.markAllAsTouched();
      return;
    }

    void this.create(this.getPayload());
  }

  finish(result: any): void {
    const sale = (result?.data ?? result) as SalesResponse;
    this.dialogRef?.close({ refresh: true, sale });
  }

  close(): void {
    this.dialogRef?.close();
  }

  private async loadOptions(): Promise<void> {
    try {
      const [customersRes, productsRes] = await Promise.all([
        this.service.getCustom('customers', { size: 200, sort: 'name,asc' }),
        this.service.getCustom('products', { size: 200, sort: 'name,asc' }),
      ]);
      this.customers = customersRes?.content ?? [];
      this.products = productsRes?.content ?? [];
    } finally {
      this.loadingData = false;
      this.cdr.detectChanges();
    }
  }

  private getPayload(): SalesRequest {
    return {
      customerId: this.dados.customerId,
      notes: this.toOptionalString(this.dados.notes),
      items: this.dados.items.map((item: { productId: string; quantity: number }) => ({
        productId: item.productId,
        quantity: Number(item.quantity),
      })),
    };
  }

  private getEmptySale() {
    return {
      customerId: '',
      notes: '',
      items: [] as { productId: string; quantity: number }[],
    };
  }

  private toOptionalString(value?: string): string | undefined {
    const trimmed = value?.trim() ?? '';
    return trimmed ? trimmed : undefined;
  }
}

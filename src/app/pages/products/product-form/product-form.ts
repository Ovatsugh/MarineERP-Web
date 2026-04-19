import { inject, Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import {
    // HlmDialogDescription,
  HlmDialogFooter,
  HlmDialogHeader,
  HlmDialogTitle,
} from '@spartan-ng/helm/dialog';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { CrudService } from '../../../services/crud.service';
import { ToolsService } from '../../../services/tools.service';
import { AbstractForm } from '../../../shared/abstract-form';
import { ProductRequest, ProductResponse } from '../../../types/product.types';

type ProductFormContext = {
  product?: ProductResponse;
  productId?: string;
};

export interface ProductFormResult {
  refresh: boolean;
  product?: ProductResponse;
}

@Component({
  selector: 'app-product-form',
  imports: [
    FormsModule,
    HlmButton,
    // HlmDialogDescription,
    HlmDialogFooter,
    HlmDialogHeader,
    HlmDialogTitle,
    HlmInputImports,
    HlmLabel,
    HlmSpinner,
    NgxMaskDirective,
  ],
  providers: [CrudService, NgxMaskPipe, provideNgxMask()],
  templateUrl: './product-form.html',
})
export class ProductForm extends AbstractForm {
  protected override readonly createSuccessMessage = 'Produto criado com sucesso.';
  protected override readonly updateSuccessMessage = 'Produto atualizado com sucesso.';
  protected override readonly saveErrorMessage = 'Não foi possível salvar o produto.';

  private readonly dialogContext = injectBrnDialogContext<ProductFormContext | undefined>({
    optional: true,
  });
  private readonly dialogRef = inject(BrnDialogRef<ProductFormResult>, {
    optional: true,
  });
  private readonly maskPipe = inject(NgxMaskPipe);

  protected readonly priceMask = 'separator.2';
  protected readonly product = this.dialogContext?.product;
  protected readonly productId = this.product?.id ?? this.dialogContext?.productId;

  constructor(service: CrudService, tools: ToolsService) {
    super(service, tools);
    this.service.path = 'products';
    this.dados = this.getEmptyProduct();

    if (this.product) {
      this.setProductData(this.product);
    } else if (this.productId) {
      void this.loadProduct(this.productId);
    }
  }

  get isEditing(): boolean {
    return !!this.productId;
  }

  submit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const payload = this.getPayload();

    if (this.productId) {
      void this.update(payload, this.productId);
      return;
    }

    void this.create(payload);
  }

  finish(result: any): void {
    const product = (result?.data ?? result) as ProductResponse;
    this.dialogRef?.close({ refresh: true, product });
  }

  close(): void {
    this.dialogRef?.close();
  }

  private async loadProduct(productId: string): Promise<void> {
    await this.getData(productId);
    this.setProductData(this.dados);
  }

  private getPayload(): ProductRequest {
    return {
      name: this.dados.name.trim(),
      bikeModel: this.dados.bikeModel.trim(),
      price: this.parseCurrencyToNumber(this.dados.price),
      stock_quantity: Number(this.dados.stock_quantity),
      code: this.toOptionalString(this.dados.code),
      description: this.toOptionalString(this.dados.description),
    };
  }

  private getEmptyProduct(): ProductRequest {
    return {
      name: '',
      bikeModel: '',
      price: null,
      stock_quantity: null,
      code: '',
      description: '',
    };
  }

  private setProductData(product?: Partial<ProductResponse>): void {
    this.dados = {
      ...this.getEmptyProduct(),
      name: product?.name ?? '',
      bikeModel: product?.bikeModel ?? '',
      price: this.formatCurrencyInput(product?.price),
      stock_quantity: product?.stock_quantity ?? null,
      code: product?.code ?? '',
      description: product?.description ?? '',
    };
  }

  private formatCurrencyInput(value?: number | null): string {
    if (value == null) {
      return '';
    }

    return this.maskPipe.transform(String(value.toFixed(2).replace('.', ',')), this.priceMask, {
      thousandSeparator: '.',
      decimalMarker: ',',
    });
  }

  private parseCurrencyToNumber(value: unknown): number {
    if (typeof value === 'number') {
      return value;
    }

    const normalized = String(value ?? '')
      .trim()
      .replace(/^R\$\s?/, '')
      .replace(/\./g, '')
      .replace(',', '.');

    return Number(normalized);
  }

  private toOptionalString(value?: string): string | undefined {
    const trimmed = value?.trim() ?? '';
    return trimmed ? trimmed : undefined;
  }
}

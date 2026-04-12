import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerEdit, tablerPlus, tablerSearch, tablerTrash } from '@ng-icons/tabler-icons';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogService } from '@spartan-ng/helm/dialog';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { CrudService } from '../../services/crud.service';
import { ToolsService } from '../../services/tools.service';
import { AbstractList } from '../../shared/abstract-list';
import { ProductResponse } from '../../types/product.types';
import { ProductForm, ProductFormResult } from './product-form/product-form';

@Component({
  selector: 'app-products',
  imports: [HlmAlertDialogImports, HlmButtonImports, HlmTableImports, HlmSelectImports, HlmInputImports, HlmSpinner, FormsModule, NgIcon, HlmIcon, HlmLabel],
  providers: [provideIcons({ tablerPlus, tablerEdit, tablerSearch, tablerTrash }), CrudService],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products extends AbstractList<ProductResponse> implements OnInit {
  deletingId: string | null = null;

  constructor(
    service: CrudService,
    tools: ToolsService,
    private readonly dialog: HlmDialogService,
  ) {
    super(service, tools);
    this.service.path = 'products';
  }

  ngOnInit(): void {
    this.initFromUrl();
  }

  openCreateDialog(): void {
    this.openProductForm();
  }

  openEditDialog(product: ProductResponse): void {
    this.openProductForm(product);
  }

  async deleteProduct(product: ProductResponse): Promise<void> {
    this.deletingId = product.id;

    try {
      await this.service.delete(product.id);
      await this.getList();
    } finally {
      this.deletingId = null;
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value ?? 0);
  }

  private openProductForm(product?: ProductResponse): void {
    const dialogRef = this.dialog.open(ProductForm, {
      contentClass: '!w-[96vw] !max-w-[96vw] !p-4 !gap-3 sm:!w-auto sm:!max-w-xl sm:!p-5',
      context: product ? { product } : {},
    });

    dialogRef.closed$.subscribe((result: ProductFormResult | undefined) => {
      if (result?.refresh) {
        void this.getList();
      }
    });
  }
}

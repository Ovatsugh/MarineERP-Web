import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerMinus, tablerPlus, tablerSearch, tablerTrash } from '@ng-icons/tabler-icons';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmScrollArea } from '@spartan-ng/helm/scroll-area';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { NgScrollbar } from 'ngx-scrollbar';
import { CrudService } from '../../services/crud.service';
import { CustomerResponse } from '../../types/customer.types';
import { ProductResponse } from '../../types/product.types';
import { SalesRequest } from '../../types/sales.types';

interface CartItem {
  productId: string;
  quantity: number;
}

@Component({
  selector: 'app-sales',
  imports: [HlmButtonImports, HlmInputImports, HlmSpinner, HlmSelectImports, FormsModule, NgIcon, HlmIcon, HlmLabel, NgScrollbar, HlmScrollArea],
  providers: [provideIcons({ tablerSearch, tablerTrash, tablerMinus, tablerPlus }), CrudService],
  templateUrl: './sales.html',
  styleUrl: './sales.css',
})
export class Sales implements OnInit {
  private readonly service = inject(CrudService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly productCache = new Map<string, ProductResponse>();

  protected products: ProductResponse[] = [];
  protected customers: CustomerResponse[] = [];
  protected cart: CartItem[] = [];
  protected selectedCustomerId = '';
  protected notes = '';
  protected search = '';

  protected loading = false;
  protected loadingProducts = false;
  protected saving = false;
  protected submitted = false;

  protected page = 0;
  protected readonly pageSize = 12;
  protected totalPages = 0;
  protected totalElements = 0;
  protected numberOfElements = 0;

  readonly pageSizes = [12, 24, 48];
  protected selectedPageSize = 12;

  ngOnInit(): void {
    void this.loadData();
  }

  get filteredProducts(): ProductResponse[] {
    const q = this.search.trim().toLowerCase();
    if (!q) return this.products;
    return this.products.filter(p =>
      p.name.toLowerCase().includes(q) || p.bikeModel?.toLowerCase().includes(q)
    );
  }

  get currentPage(): number {
    return this.totalElements ? this.page + 1 : 0;
  }

  get canGoToPreviousPage(): boolean {
    return this.page > 0;
  }

  get canGoToNextPage(): boolean {
    return this.page < this.totalPages - 1;
  }

  get cartTotal(): number {
    return this.cart.reduce((total, item) => {
      return total + (this.productCache.get(item.productId)?.price ?? 0) * item.quantity;
    }, 0);
  }

  async goToPreviousPage(): Promise<void> {
    if (!this.canGoToPreviousPage) return;
    this.page--;
    await this.loadProducts();
  }

  async goToNextPage(): Promise<void> {
    if (!this.canGoToNextPage) return;
    this.page++;
    await this.loadProducts();
  }

  async onPageSizeChange(size: number): Promise<void> {
    this.selectedPageSize = size;
    this.page = 0;
    await this.loadProducts();
  }

  addToCart(product: ProductResponse): void {
    const existing = this.cart.find(i => i.productId === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      this.cart.push({ productId: product.id, quantity: 1 });
    }
  }

  removeFromCart(productId: string): void {
    this.cart = this.cart.filter(i => i.productId !== productId);
  }

  incrementItem(productId: string): void {
    const item = this.cart.find(i => i.productId === productId);
    if (item) item.quantity++;
  }

  decrementItem(productId: string): void {
    const item = this.cart.find(i => i.productId === productId);
    if (!item) return;
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.removeFromCart(productId);
    }
  }

  setItemQuantity(productId: string, value: number): void {
    const qty = Math.max(1, Math.floor(Number(value) || 1));
    const item = this.cart.find(i => i.productId === productId);
    if (item) item.quantity = qty;
  }

  getCartQuantity(productId: string): number {
    return this.cart.find(i => i.productId === productId)?.quantity ?? 0;
  }

  getProductName(productId: string): string {
    return this.productCache.get(productId)?.name ?? '';
  }

  getProductCode(productId: string): string | undefined {
    return this.productCache.get(productId)?.code;
  }

  getProductPrice(productId: string): number {
    return this.productCache.get(productId)?.price ?? 0;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value ?? 0);
  }

  async submitSale(): Promise<void> {
    this.submitted = true;
    if (!this.selectedCustomerId || this.cart.length === 0) return;

    const payload: SalesRequest = {
      customerId: this.selectedCustomerId,
      notes: this.notes.trim() || undefined,
      items: this.cart.map(i => ({ productId: i.productId, quantity: i.quantity })),
    };

    this.saving = true;
    this.service.path = 'sales';
    try {
      await this.service.create(payload);
      this.cart = [];
      this.selectedCustomerId = '';
      this.notes = '';
      this.submitted = false;
    } finally {
      this.saving = false;
      this.cdr.detectChanges();
    }
  }

  private async loadProducts(): Promise<void> {
    this.loadingProducts = true;
    try {
      const res = await this.service.getCustom('products', {
        page: this.page,
        size: this.selectedPageSize,
        sort: 'name,asc',
      });
      this.products = res?.content ?? [];
      this.totalPages = res?.totalPages ?? 0;
      this.totalElements = res?.totalElements ?? 0;
      this.numberOfElements = res?.numberOfElements ?? 0;
      for (const p of this.products) {
        this.productCache.set(p.id, p);
      }
    } finally {
      this.loadingProducts = false;
      this.cdr.detectChanges();
    }
  }

  private async loadData(): Promise<void> {
    this.loading = true;
    try {
      const [, customersRes] = await Promise.all([
        this.loadProducts(),
        this.service.getCustom('customers', { size: 200, sort: 'name,asc' }),
      ]);
      this.customers = customersRes?.content ?? [];
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}

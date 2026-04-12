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
import { CustomerResponse } from '../../types/customer.types';
import { CustomerForm, CustomerFormResult } from './customer-form/customer-form';

@Component({
  selector: 'app-customers',
  imports: [HlmAlertDialogImports, HlmButtonImports, HlmTableImports, HlmSelectImports, HlmInputImports, HlmSpinner, FormsModule, NgIcon, HlmIcon, HlmLabel],
  providers: [provideIcons({ tablerPlus, tablerEdit, tablerSearch, tablerTrash }), CrudService],
  templateUrl: './customers.html',
  styleUrl: './customers.css',
})
export class Customers extends AbstractList<CustomerResponse> implements OnInit {
  deletingId: string | null = null;

  constructor(
    service: CrudService,
    tools: ToolsService,
    private readonly dialog: HlmDialogService,
  ) {
    super(service, tools);
    this.service.path = 'customers';
  }

  ngOnInit(): void {
    this.initFromUrl();
  }

  openCreateDialog(): void {
    this.openCustomerForm();
  }

  openEditDialog(customer: CustomerResponse): void {
    this.openCustomerForm(customer);
  }

  async deleteCustomer(customer: CustomerResponse): Promise<void> {
    this.deletingId = customer.id;

    try {
      await this.service.delete(customer.id);
      await this.getList();
    } finally {
      this.deletingId = null;
    }
  }

  formatCpf(cpf: string): string {
    return cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') ?? '-';
  }

  formatPhone(phone: string): string {
    if (!phone) return '-';
    if (phone.length === 11) return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    if (phone.length === 10) return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    return phone;
  }

  private openCustomerForm(customer?: CustomerResponse): void {
    const dialogRef = this.dialog.open(CustomerForm, {
      contentClass: '!w-[96vw] !max-w-[96vw] !p-4 !gap-3 sm:!w-auto sm:!max-w-lg sm:!p-5',
      context: customer ? { customer } : {},
    });

    dialogRef.closed$.subscribe((result: CustomerFormResult | undefined) => {
      if (result?.refresh) {
        void this.getList();
      }
    });
  }
}

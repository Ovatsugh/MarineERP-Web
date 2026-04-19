import { inject, Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import {
  HlmDialogFooter,
  HlmDialogHeader,
  HlmDialogTitle,
} from '@spartan-ng/helm/dialog';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CrudService } from '../../../services/crud.service';
import { ToolsService } from '../../../services/tools.service';
import { AbstractForm } from '../../../shared/abstract-form';
import { CustomerRequest, CustomerResponse } from '../../../types/customer.types';

type CustomerFormContext = {
  customer?: CustomerResponse;
  customerId?: string;
};

export interface CustomerFormResult {
  refresh: boolean;
  customer?: CustomerResponse;
}

@Component({
  selector: 'app-customer-form',
  imports: [
    FormsModule,
    HlmButton,
    HlmDialogFooter,
    HlmDialogHeader,
    HlmDialogTitle,
    HlmInputImports,
    HlmLabel,
    HlmSpinner,
    NgxMaskDirective,
  ],
  providers: [CrudService, provideNgxMask()],
  templateUrl: './customer-form.html',
})
export class CustomerForm extends AbstractForm {
  protected override readonly createSuccessMessage = 'Cliente criado com sucesso.';
  protected override readonly updateSuccessMessage = 'Cliente atualizado com sucesso.';
  protected override readonly saveErrorMessage = 'Não foi possível salvar o cliente.';

  private readonly dialogContext = injectBrnDialogContext<CustomerFormContext | undefined>({
    optional: true,
  });
  private readonly dialogRef = inject(BrnDialogRef<CustomerFormResult>, {
    optional: true,
  });

  protected readonly cpfMask = '000.000.000-00';
  protected readonly phoneMask = '(00) 00000-0000';
  protected readonly customer = this.dialogContext?.customer;
  protected readonly customerId = this.customer?.id ?? this.dialogContext?.customerId;

  constructor(service: CrudService, tools: ToolsService) {
    super(service, tools);
    this.service.path = 'customers';
    this.dados = this.getEmptyCustomer();

    if (this.customer) {
      this.setCustomerData(this.customer);
    } else if (this.customerId) {
      void this.loadCustomer(this.customerId);
    }
  }

  get isEditing(): boolean {
    return !!this.customerId;
  }

  submit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const payload = this.getPayload();

    if (this.customerId) {
      void this.update(payload, this.customerId);
      return;
    }

    void this.create(payload);
  }

  finish(result: any): void {
    const customer = (result?.data ?? result) as CustomerResponse;
    this.dialogRef?.close({ refresh: true, customer });
  }

  close(): void {
    this.dialogRef?.close();
  }

  private async loadCustomer(customerId: string): Promise<void> {
    await this.getData(customerId);
    this.setCustomerData(this.dados);
  }

  private getPayload(): CustomerRequest {
    return {
      name: this.dados.name.trim(),
      cpf: this.dados.cpf,
      phone: this.dados.phone,
    };
  }

  private getEmptyCustomer(): CustomerRequest {
    return {
      name: '',
      cpf: '',
      phone: '',
    };
  }

  private setCustomerData(customer?: Partial<CustomerResponse>): void {
    this.dados = {
      ...this.getEmptyCustomer(),
      name: customer?.name ?? '',
      cpf: customer?.cpf ?? '',
      phone: customer?.phone ?? '',
    };
  }
}

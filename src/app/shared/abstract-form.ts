import { NgForm } from "@angular/forms";
import { toast } from "@spartan-ng/brain/sonner";
import { CrudService } from "../services/crud.service";
import { ToolsService } from "../services/tools.service";

export abstract class AbstractForm { 

    loading = false;
	loadingData = false;
	saving = false;
	dados: any = {};

	protected readonly createSuccessMessage: string = 'Registro criado com sucesso.';
	protected readonly updateSuccessMessage: string = 'Registro atualizado com sucesso.';
	protected readonly saveErrorMessage: string = 'Não foi possível salvar o registro.';

    constructor(public service: CrudService, public tools: ToolsService) {}

	abstract submit(form: NgForm): void;
	abstract finish(result: any): void;

	private syncLoadingState() {
		this.loading = this.loadingData || this.saving;
	}


    async getData(id: any) {
		this.loadingData = true;
		this.syncLoadingState();
		await this.service
			.show(id)
			.then((res) => {
				this.dados = res?.data ?? res;
			})
			.finally(() => {
				this.loadingData = false;
				this.syncLoadingState();
			});
	}

	async create(dados: any) {
		this.saving = true;
		this.syncLoadingState();
		try {
			const res = await this.service.create(dados);
			toast.success(this.createSuccessMessage);
			this.finish(res);
		} catch {
			toast.error(this.saveErrorMessage);
		} finally {
			this.saving = false;
			this.syncLoadingState();
		}
	}

	async update(dados: any, id: any) {
		this.saving = true;
		this.syncLoadingState();
		try {
			const res = await this.service.update(dados, id);
			toast.success(this.updateSuccessMessage);
			this.finish(res);
		} catch {
			toast.error(this.saveErrorMessage);
		} finally {
			this.saving = false;
			this.syncLoadingState();
		}
	}
}

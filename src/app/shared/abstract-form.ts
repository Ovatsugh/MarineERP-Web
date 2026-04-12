import { NgForm } from "@angular/forms";
import { CrudService } from "../services/crud.service";
import { ToolsService } from "../services/tools.service";

export abstract class AbstractForm { 

    loading = false;
	loadingData = false;
	saving = false;
	dados: any = {};

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
		await this.service
			.create(dados)
			.then((res) => {
				this.finish(res);
			})
			.finally(() => {
				this.saving = false;
				this.syncLoadingState();
			});
	}

	async update(dados: any, id: any) {
		this.saving = true;
		this.syncLoadingState();
		await this.service
			.update(dados, id)
			.then((res) => {
				this.finish(res);
			})
			.finally(() => {
				this.saving = false;
				this.syncLoadingState();
			});
	}
}

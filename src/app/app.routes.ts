import { Routes } from '@angular/router';
import { Products } from './pages/products/products';
import { Dashboard } from './pages/dashboard/dashboard';
import { Customers } from './pages/customers/customers';
import { Employes } from './pages/employes/employes';
import { Sales } from './pages/sales/sales';
import { Auth } from './pages/auth/auth';
import { Layout } from './layout/layout';
import { authGuard } from './guards/auth.guard';
import { Account } from './pages/account/account';

export const routes: Routes = [
    {
        path: '',
        component: Layout,
        canActivate: [authGuard],
        children: [
            { path: '', component: Dashboard },
            { path: 'produtos', component: Products },
            { path: 'time', component: Employes },
            { path: 'clientes', component: Customers },
            { path: 'vendas', component: Sales },
            { path: 'account', component: Account },
        ]
    },
    {
        path: 'auth',
        component: Auth,
    }
];

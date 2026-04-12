import { Routes } from '@angular/router';
import { Products } from './pages/products/products';
import { Dashboard } from './pages/dashboard/dashboard';
import { Customers } from './pages/customers/customers';
import { Employes } from './pages/employes/employes';
import { Sales } from './pages/sales/sales';

export const routes: Routes = [

     {
        path: '',
        component: Dashboard
    },
    {
        path: 'produtos',
        component: Products
    },
   
     {
        path: 'time',
        component: Employes
    },
     {
        path: 'clientes',
        component: Customers
        
    },
     {
        path: 'vendas',
        component: Sales
    }
];


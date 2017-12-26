import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ArticleComponent } from './article/article.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { RegisterComponent } from './register/register.component';


const routes: Routes = [
	{
		path: '',
		component: HomeComponent
	},
	{
		path: 'articles/category/:category',
		component: HomeComponent
	},
	{
		path: 'articles/author/:author',
		component: HomeComponent
	},
	{
		path: 'articles/:id',
		component: ArticleComponent
	},
	{
		path: 'create',
		component: CreateComponent
	},
	{
		path: 'edit/:id',
		component: EditComponent
	},
	{
		path: 'register',
		component: RegisterComponent
	},
	{
		path: '**',
		redirectTo:'/'
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

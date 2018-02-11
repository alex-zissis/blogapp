import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../article.service';
import { AuthService } from '../auth.service';
import { CategoryService } from '../category.service';
import { ErrorService } from '../error.service';
import { Category } from '../category';
import { Article } from '../article';
import { User } from '../user';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  articleFrm: FormGroup;
  articles: Array<Article>;
  categories: Array<Category>;
  user: User;

  constructor(private _errorService: ErrorService,
    private _authService: AuthService,
    private _articleService: ArticleService,
    private _categoryService: CategoryService,
    private router: Router,
    private aR: ActivatedRoute,
    private fb: FormBuilder) { }

  ngOnInit() {
    this._authService.getUserInfo()
      .subscribe(res => this.user = res);

    this._categoryService.getCategories()
      .subscribe(res => this.categories = res);

    this._articleService.getArticles()
      .subscribe(res => this.articles = res);

    this.articleFrm = this.fb.group({
      'title' : [null, Validators.compose([Validators.required, Validators.minLength(10)])],
      'content' : [null, Validators.compose([Validators.required, Validators.minLength(10)])],
      'category': [null, Validators.compose([Validators.required, Validators.minLength(2)])]
    });
  }

  addArticle(article) {
    article.author = this.user.username;
    this._articleService.insertArticle(article)
      .subscribe(newArticle => {
        this.articles.push(newArticle);
        this.router.navigateByUrl('/');
      },
      err => {
        const response = JSON.parse(err._body);
        if (err.status === 401) {
            const errObj = {
              type: 'error',
              name: response.type,
              message: response.message,
              statusCode: 401,
              expires: true
          };
          this.pushError(errObj);
          if (errObj.name === 'jwterror') {
            this._authService.clearToken();
            this.router.navigateByUrl('/login');
          } else {
            this.router.navigateByUrl('/');
          }
    }
  });
}

  pushError(err) {
    this._errorService.showError(err);
  }
}

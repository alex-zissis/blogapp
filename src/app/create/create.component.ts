import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../article.service';
import { CategoryService } from '../category.service';
import { Article } from '../article';
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

  constructor(private _articleService: ArticleService, private _categoryService: CategoryService, private router: Router, private aR: ActivatedRoute, private fb: FormBuilder) { }
  
  ngOnInit() {
    //this._categoryService.getCategories()

    this._articleService.getArticles()
      .subscribe(res=> this.articles = res);

    this.articleFrm = this.fb.group({
      'title' : [null, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(45)])],
      'content' : [null, Validators.compose([Validators.required, Validators.minLength(10)])],
      'author' : [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(45)])]
    });
  }

  addArticle(article: Article) {
    this._articleService.insertArticle(article)
      .subscribe(newArticle => {
        this.articles.push(newArticle);
        this.router.navigateByUrl('/');
      })
  }
}

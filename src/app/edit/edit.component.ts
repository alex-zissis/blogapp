import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../article.service';
import { CategoryService } from '../category.service';
import { Article } from '../article';
import { Category } from '../category';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  articleId: string;
  article: Article;
  articleFrm: FormGroup;
  articles: Array<Article>;
  categories: Array<Category>;
  showSpinnerEdit: boolean = true;

  constructor(private _articleService: ArticleService, private _categoryService: CategoryService, private router: Router, private aR: ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit() {
    this._categoryService.getCategories()
      .subscribe(res => this.categories = res);

    this._articleService.getArticles()
      .subscribe(res => this.articles = res);

    this.aR.params.subscribe((params) => {
      this.articleId = params.id;
      this._articleService.getArticle(params.id)
        .subscribe((res) => {
          this.article = res;
          console.log(this.article);

          this.populateForm(function () {
            //console.log('please work');
          });
        });
    });

  }

  populateForm(callback){
    this.articleFrm = this.fb.group({
      'title' : [this.article['title'], Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(45)])],
      'content' : [this.article['content'], Validators.compose([Validators.required, Validators.minLength(10)])],
      'category': [this.article['category'], Validators.compose([Validators.required, Validators.minLength(2)])]
    });

    this.showSpinnerEdit = false;
  }

  editArticle(article) {
    console.log(article);
    this._articleService.updateArticle(this.articleId, article)
      .subscribe(updatedArticle => {
        this.router.navigateByUrl('/');
      })
  }
}



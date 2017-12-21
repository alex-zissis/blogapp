import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../article.service';
import { Article } from '../article';
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

  constructor(private _articleService: ArticleService, private router: Router, private aR: ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit() {
    this._articleService.getArticles()
      .subscribe(res=> this.articles = res);

    this.aR.params.subscribe((params) => {
      this.articleId = params.id;
      this._articleService.getArticle(params.id)
        .subscribe((res) => {
          this.article = res;
          console.log(this.article);

          this.articleFrm = this.fb.group({
            'title' : [this.article['title'], Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(45)])],
            'content' : [this.article['content'], Validators.compose([Validators.required, Validators.minLength(10)])],
          });
        });
    });

  }

  editArticle(article) {
    console.log(article);
    this._articleService.updateArticle(this.articleId, article)
      .subscribe(updatedArticle => {
        this.updateArrayVal(this.articleId, updatedArticle);
        this.router.navigateByUrl('/');
      })
  }

  updateArrayVal( id, obj ) {
    for (var i in this.articles) {
      if (this.articles[i]._id == id) {
        this.articles[i] = obj;
         break; //Stop this loop, we found it!
      }
    }
  }
}



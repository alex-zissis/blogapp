import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../article.service';
import { Article } from '../article';
import { CategoryService } from '../category.service';
import { Category } from '../category';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  article: Article;
  categoryA: Category;

  showSpinnerArticle: boolean = true;

  constructor(private _articleService: ArticleService, private _categoryService: CategoryService, private router: Router, private aR: ActivatedRoute) { }

  ngOnInit() {
  	this.aR.params.subscribe((params) => {
      let id = params['id'];

  		this._articleService.getArticle(id)
  			.subscribe(res => {
          this.article = res;
          console.log(this.article);
          this.showSpinnerArticle = false;
          this._categoryService.getCategoryInfo(this.article.category)
            .subscribe(result => {
              this.categoryA = result;
              document.getElementById('artTitle').style.color = this.categoryA.color;
              document.getElementById('artContainer').style.borderLeft = "10px solid " + this.categoryA.color;
            });
        });
  	});
  }

  deleteArticle(id){
    this._articleService.deleteArticle(id)
      .subscribe(res => {
        this.router.navigateByUrl('/');
      });
  }

}

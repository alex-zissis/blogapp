import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../article.service';
import { CategoryService } from '../category.service';
import { AuthService } from '../auth.service';
import { Article } from '../article';
import { Category } from '../category';
import { Filter } from '../filter';
import { filterQueryId } from '@angular/core/src/view/util';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  deviceInfo = null;
  articles: Array<Article>;
  categories: Array<Category>;
  authorName: string;
  categoryName: string;
  filtered = new Filter;

  showSpinner: boolean = true;

  constructor(private _articleService: ArticleService, private _authService : AuthService, private _categoryService: CategoryService, private aR: ActivatedRoute) {
  }

    ngOnInit() {
      this.showSpinner = true;

      this._categoryService.getCategories()
          .subscribe(result => {
            this.categories = result;
      });

      this.aR.params.subscribe(params => {
        this.categoryName =  this.aR.snapshot.paramMap.get('category');
        this.authorName =  this.aR.snapshot.paramMap.get('author');

        if(this.categoryName == null && this.authorName == null){
          this.filtered.type = null;
          this.filtered.filterVal = null;
        }else if (this.categoryName != null) {
          this.filtered.type = 'category';
          this.filtered.filterVal = this.categoryName;
        }else if (this.authorName != null) {
          this.filtered.type = 'author';
          this.filtered.filterVal = this.authorName;
        }
        this.displayArticles();
      });
    }

    displayArticles() {
      if(this.filtered == undefined || this.filtered.type == null){
        this._articleService.getArticles()
          .subscribe(res => {
            this.articles = res;
            for(var i = 0; i < this.articles.length; i++){
              var articleObj = this.articles[i];
              this.formatPost(articleObj);
            }
            
            for(var i = 0; i < this.categories.length; i++){
              var categoryObj = this.categories[i];
              this.formatCategory(categoryObj);
            }
          });
      }else{
        switch (this.filtered.type) {
          case 'author':
            this._articleService.getArticlesByAuthor(this.filtered.filterVal)
              .subscribe(res => {
                this.articles = res;
                for(var i = 0; i < this.articles.length; i++){
                  var articleObj = this.articles[i];
                  this.formatPost(articleObj);
                }
                for(var i = 0; i < this.categories.length; i++){
                  var categoryObj = this.categories[i];
                  this.formatCategory(categoryObj);
                }
              });
            break;
          case 'category':
            this._articleService.getArticlesByCategory(this.filtered.filterVal)
              .subscribe(res => {
                this.articles = res;
                for(var i = 0; i < this.articles.length; i++){
                  var articleObj = this.articles[i];
                  this.formatPost(articleObj);
                }
                for(var i = 0; i < this.categories.length; i++){
                  var categoryObj = this.categories[i];
                  this.formatCategory(categoryObj);
                }
              });
            break;
        }
      }
      this.showSpinner = false;
    }

    formatPost(articleObj) {
      var category: Category;
      this._categoryService.getCategoryInfo(articleObj.category)
            .subscribe(result => {
              category = result;
              document.getElementById(articleObj._id).style.borderLeft = "10px solid " + category.color;
              document.getElementById('artTitleLink' + articleObj._id).style.color = category.color;
            });
    }

    formatCategory(categoryObj) {
      document.getElementById("catFilterBtn" + categoryObj.name).style.color = categoryObj.color;
      document.getElementById("catFilterBtn" + categoryObj.name).style.border = "2px solid " + categoryObj.color;
    }

}

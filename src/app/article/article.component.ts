import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../article.service';
import { Article } from '../article';
import { CategoryService } from '../category.service';
import { Category } from '../category';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  isLoggedIn: Observable<boolean>;
  hasToken: boolean;
  article: Article;
  categoryA: Category;
  user: any;
  isAuthor = false;

  showSpinnerArticle = true;

  constructor(
    private _articleService: ArticleService,
    private _categoryService: CategoryService,
    private router: Router, private aR: ActivatedRoute,
    private _authService: AuthService) {
      this.isLoggedIn = _authService.isLoggedInObvs();
      this.hasToken = _authService.isLoggedIn();
    }

  ngOnInit() {
    this.aR.params.subscribe((params) => {
      const id = params['id'];

      this._articleService.getArticle(id)
        .subscribe(res => {
          this.article = res;
          if (this.hasToken) {
            this._authService.getUserInfo()
              .subscribe(result => {
                this._authService.isLoginSubject.next(true);
                this.user = result;
                console.log(this.user);
                if (this.user.username === this.article.author) {
                  this.isAuthor = true;
                }
              });
            }
          this._categoryService.getCategoryInfo(this.article.category)
            .subscribe(result => {
              this.categoryA = result;
              document.getElementById('artTitle').style.color = this.categoryA.color;
              document.getElementById('artContainer').style.borderLeft = '10px solid ' + this.categoryA.color;
              this.showSpinnerArticle = false;
            });
        });
    });
  }

  deleteArticle(id) {
    this._articleService.deleteArticle(id)
      .subscribe(res => {
        this.router.navigateByUrl('/');
      });
  }

}

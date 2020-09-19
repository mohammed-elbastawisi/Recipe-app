import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {RecipeService} from '../recipe/recipe.service';
import {Recipe} from '../recipe/recipe.model';
import {map, tap} from 'rxjs/operators';
import {AuthService} from '../auth/auth.service';

@Injectable({providedIn: 'root'})
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) {}

  // tslint:disable-next-line:typedef
  storeRecipes(){
    const recipes = this.recipeService.getRecipes();
    this.http.put('https://httpstartangular.firebaseio.com/recipes.json', recipes).subscribe(response => {
      console.log(response);
    });
  }

  // tslint:disable-next-line:typedef
  fetchRecipes() {
      return this.http.get<Recipe[]>('https://httpstartangular.firebaseio.com/recipes.json', {
        }).pipe(map(recipes => {
        return recipes.map(recipe => {
          return {
            name: recipe.name,
            description: recipe.description,
            imagePath: recipe.imagePath,
            ingredients: recipe.ingredients ? recipe.ingredients : []};
        });
      }),
      tap(recipes => {
        this.recipeService.setRecipes(recipes);
      }));
  }
}

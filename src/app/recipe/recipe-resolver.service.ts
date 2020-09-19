import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Recipe} from './recipe.model';
import {Injectable} from '@angular/core';
import {DataStorageService} from '../shared/data-storage.service';
import {RecipeService} from './recipe.service';

@Injectable({providedIn: 'root'})
export class RecipeResolverService implements Resolve<Recipe[]>{
  constructor(private dataStorageService: DataStorageService, private recipeService: RecipeService) {
  }
  // tslint:disable-next-line:typedef
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const recipes = this.recipeService.getRecipes();
    if (recipes.length === 0 ){
      return this.dataStorageService.fetchRecipes();
    }else {
      return recipes;
    }
  }
}

import {Injectable} from '@angular/core';
import {Recipe} from './recipe.model';
import {Ingredient} from '../shared/ingredients.model';
import {ShoppingListService} from '../shopping-list/shopping-list.service';
import {Subject} from 'rxjs';

@Injectable()
export class RecipeService {
  recipeChanged = new Subject<Recipe[]>();
  private recipes: Recipe[] = [];
  constructor(private slService: ShoppingListService) {}

  // tslint:disable-next-line:typedef
  setRecipes(recipes: Recipe[]){
    this.recipes = recipes;
    this.recipeChanged.next(this.recipes.slice());
  }
  getRecipes(): Recipe[]{
    return this.recipes.slice();
  }

  // the method below will return the index of the chosen recipe to use it in routing /recipe/:id
  gerRecipeIndex(index: number): Recipe{
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredient: Ingredient[]): void {
    this.slService.addIngredientsToSL(ingredient);
  }

  addRecipe(recipe: Recipe): void{
    this.recipes.push(recipe);
    this.recipeChanged.next(this.recipes.slice());
  }
  updateRecipe(index: number, newRecipe: Recipe): void{
    this.recipes[index] = newRecipe;
    this.recipeChanged.next(this.recipes.slice());
  }
  deleteRecipe(index: number): void{
    this.recipes.splice(index, 1);
    this.recipeChanged.next(this.recipes.slice());
  }
}

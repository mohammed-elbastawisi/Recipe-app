import {Ingredient} from '../shared/ingredients.model';
import {Subject} from 'rxjs';

export class ShoppingListService {
  ingredientChanged = new Subject<Ingredient[]>();
  startEditing = new Subject<number>();
  private ingredients: Ingredient[] = [
    new Ingredient('Apple', 5),
    new Ingredient('Tomatoes', 10),
  ];
  // tslint:disable-next-line:typedef
  getIngredients(): Ingredient[] {
    return this.ingredients.slice();
  }
  getIngredient(index: number): Ingredient{
    return this.ingredients[index];
  }
  // tslint:disable-next-line:typedef
  addIngredient(ingredient: Ingredient){
    this.ingredients.push(ingredient);
    this.ingredientChanged.next(this.ingredients.slice());
  }
  // tslint:disable-next-line:typedef
  addIngredientsToSL(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.ingredientChanged.next(this.ingredients.slice());
  }
  onUpdateIngredient(index: number, newIngredient: Ingredient): void{
    this.ingredients[index] = newIngredient;
    this.ingredientChanged.next(this.ingredients.slice());
  }
  onDeletingIngredient(index): void{
    this.ingredients.splice(index, 1);
    this.ingredientChanged.next(this.ingredients.slice());
  }
}

import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {Recipe} from '../recipe.model';
import {RecipeService} from '../recipe.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
 recipes: Recipe[];
 subsribtion: Subscription;
  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.subsribtion = this.recipeService.recipeChanged.subscribe(
      (recipe) => {
        this.recipes = recipe;
      }
    );
    this.recipes = this.recipeService.getRecipes();
  }

  ngOnDestroy(): void {
    this.subsribtion.unsubscribe();
  }

}

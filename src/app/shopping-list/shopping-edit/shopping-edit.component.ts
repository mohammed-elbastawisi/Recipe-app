import {Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, OnDestroy} from '@angular/core';
import {Ingredient} from '../../shared/ingredients.model';
import {ShoppingListService} from '../shopping-list.service';
import { NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private slService: ShoppingListService) { }

  ngOnInit(): void {
    this.subscription = this.slService.startEditing.subscribe(
      (index: number) => {
        this.editedItemIndex = index;
        this.editMode = true;
        this.editedItem = this.slService.getIngredient(index);
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount,
        });
      }
    );
  }
  // tslint:disable-next-line:typedef
  onAddItem(form: NgForm) {
    const fromValue = form.value;
    const newIngredient = new Ingredient(fromValue.name, fromValue.amount);
    if (this.editMode){
      this.slService.onUpdateIngredient(this.editedItemIndex, newIngredient);
    }else {
      this.slService.addIngredient(newIngredient);
    }
    this.editMode = false;
    form.reset();
  }
  onClear(): void{
    this.slForm.reset();
    this.editMode = false;
  }
  onDeletingFromList(): void{
    this.slService.onDeletingIngredient(this.editedItemIndex);
    this.onClear();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

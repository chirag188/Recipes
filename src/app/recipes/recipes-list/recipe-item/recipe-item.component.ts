import { Component, Input, OnInit ,EventEmitter, Output} from '@angular/core';
import { RecipeService } from '../../recipe.service';
import { Recipes } from '../../recipes.model';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent implements OnInit {
  @Input() recipe!: Recipes;
  @Input() index!: number;
//  @Output() recipeSelected = new EventEmitter<void>();
  constructor(private recipeService:RecipeService) { }

  ngOnInit(): void {
  }
  onSelected(){
    this.recipeService.recipeSelectd.emit(this.recipe);
  }

}

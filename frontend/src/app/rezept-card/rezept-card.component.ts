import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Rezept } from 'kern-util/lib/domain';

@Component({
  selector: 'app-rezept-card',
  templateUrl: './rezept-card.component.html',
  styleUrls: ['./rezept-card.component.css']
})
export class RezeptCardComponent {
  @Input() public rezept!: Rezept
  @Output() delete = new EventEmitter<number>()
  @Output() update = new EventEmitter<number>()

  deleteRezept() {
    this.delete.emit(this.rezept.getId())
  }

  editRezept() {
    this.update.emit(this.rezept.getId())
  }
}
